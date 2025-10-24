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
  Mail,
  Truck
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export const DeliveryNoteView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDeliveryNoteById, customers, user } = useInvoiceStore();
  const printRef = useRef<HTMLDivElement>(null);

  const deliveryNote = id ? getDeliveryNoteById(id) : null;
  const customer = deliveryNote ? customers.find(c => c.id === deliveryNote.customerId) : null;

  if (!deliveryNote || !customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Delivery note not found</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'in_transit':
        return <Badge variant="default">In Transit</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
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

      pdf.save(`${deliveryNote.deliveryNumber}.pdf`);
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
            onClick={() => navigate('/delivery-notes')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Delivery Notes</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deliveryNote.deliveryNumber}</h1>
            {getStatusBadge(deliveryNote.status)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/delivery-notes/${id}/edit`)}
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

      {/* Delivery Note Content */}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">DELIVERY NOTE</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Delivery #: <span className="font-medium text-gray-900">{deliveryNote.deliveryNumber}</span></div>
                <div>Delivery Date: <span className="font-medium text-gray-900">{new Date(deliveryNote.deliveryDate).toLocaleDateString()}</span></div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Deliver To:
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
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {deliveryNote.lineItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{deliveryNote.lineItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quantity:</span>
                  <span className="font-medium">{deliveryNote.lineItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {deliveryNote.notes && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-600" />
                Delivery Notes:
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{deliveryNote.notes}</p>
              </div>
            </div>
          )}

          {/* Signature Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">Delivered By:</p>
                <div className="border-b border-gray-300 pb-2 mb-2"></div>
                <p className="text-xs text-gray-500">Signature & Date</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">Received By:</p>
                <div className="border-b border-gray-300 pb-2 mb-2"></div>
                <p className="text-xs text-gray-500">Signature & Date</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};