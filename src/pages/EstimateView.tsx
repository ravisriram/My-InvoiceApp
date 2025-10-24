import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Edit,
  Calendar,
  User,
  Building2,
  Phone,
  Mail
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export const EstimateView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEstimateById, customers, user } = useInvoiceStore();
  const printRef = useRef<HTMLDivElement>(null);

  const estimate = id ? getEstimateById(id) : null;
  const customer = estimate ? customers.find(c => c.id === estimate.customerId) : null;

  if (!estimate || !customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Estimate not found</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      case 'expired':
        return <Badge variant="warning">Expired</Badge>;
      case 'draft':
        return <Badge variant="warning">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    try {
      toast.loading('Generating PDF...', { id: 'pdf-generation' });
      
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${estimate.estimateNumber}.pdf`);
      toast.success('PDF downloaded successfully!', { id: 'pdf-generation' });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: 'pdf-generation' });
      console.error('PDF generation error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/estimates')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Estimates</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{estimate.estimateNumber}</h1>
            {getStatusBadge(estimate.status)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/estimates/${id}/edit`)}
            className="flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handlePrint}
            className="flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Estimate Content */}
      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8" ref={printRef}>
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.company}</h2>
              <div className="text-gray-600 space-y-1">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  {user?.address}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {user?.phone}
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ESTIMATE</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Estimate #: <span className="font-medium text-gray-900">{estimate.estimateNumber}</span></div>
                <div>Issue Date: <span className="font-medium text-gray-900">{new Date(estimate.issueDate).toLocaleDateString()}</span></div>
                <div>Valid Until: <span className="font-medium text-gray-900">{new Date(estimate.validUntil).toLocaleDateString()}</span></div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Estimate For:
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-900 text-lg">{customer.name}</div>
              <div className="text-gray-600 mt-2 space-y-1">
                <div>{customer.address}</div>
                <div>{customer.phone}</div>
                <div>{customer.email}</div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Qty</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Rate</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Discount</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Tax</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {estimate.lineItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.discountPercent}%</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.taxPercent}%</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">${item.lineTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${estimate.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">-${estimate.totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${estimate.totalTax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">${estimate.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Terms & Conditions:</p>
              <p>This estimate is valid until {new Date(estimate.validUntil).toLocaleDateString()}. Prices are subject to change after this date.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};