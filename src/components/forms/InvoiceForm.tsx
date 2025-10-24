import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoiceStore } from '../../store/useInvoiceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { LineItem } from '../../types';
import { 
  Plus, 
  Trash2, 
  Save, 
  DollarSign, 
  ArrowLeft,
  Calendar,
  User,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';

export const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    customers, 
    products, 
    addInvoice, 
    updateInvoice, 
    getInvoiceById,
    calculateLineTotal,
    calculateInvoiceTotals
  } = useInvoiceStore();

  const isEditing = Boolean(id);
  const existingInvoice = id ? getInvoiceById(id) : null;

  const [formData, setFormData] = useState({
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'paid' | 'unpaid'
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: Date.now().toString(),
      productName: '',
      quantity: 1,
      price: 0,
      taxPercent: 10,
      discountPercent: 0,
      lineTotal: 0
    }
  ]);

  useEffect(() => {
    if (existingInvoice) {
      setFormData({
        customerId: existingInvoice.customerId,
        issueDate: existingInvoice.issueDate,
        dueDate: existingInvoice.dueDate,
        status: existingInvoice.status
      });
      setLineItems(existingInvoice.lineItems);
    }
  }, [existingInvoice]);

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    setLineItems(items => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Recalculate line total
      const lineTotal = calculateLineTotal(newItems[index]);
      newItems[index].lineTotal = lineTotal;
      
      return newItems;
    });
  };

  const addLineItem = () => {
    setLineItems(items => [
      ...items,
      {
        id: Date.now().toString(),
        productName: '',
        quantity: 1,
        price: 0,
        taxPercent: 10,
        discountPercent: 0,
        lineTotal: 0
      }
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(items => items.filter((_, i) => i !== index));
  };

  const selectProduct = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateLineItem(index, 'productId', productId);
      updateLineItem(index, 'productName', product.name);
      updateLineItem(index, 'price', product.price);
      updateLineItem(index, 'taxPercent', product.defaultTax);
    }
  };

  const totals = calculateInvoiceTotals(lineItems);

  const handleSubmit = (status: 'draft' | 'paid' | 'unpaid') => {
    if (!formData.customerId) {
      toast.error('Please select a customer');
      return;
    }

    if (lineItems.some(item => !item.productName || item.quantity <= 0 || item.price < 0)) {
      toast.error('Please fill in all line items correctly');
      return;
    }

    const invoiceData = {
      ...formData,
      lineItems,
      status,
      subtotal: totals.subtotal,
      totalTax: totals.totalTax,
      totalDiscount: totals.totalDiscount,
      grandTotal: totals.grandTotal
    };

    if (isEditing && id) {
      updateInvoice(id, invoiceData);
      toast.success('Invoice updated successfully');
    } else {
      addInvoice(invoiceData);
      toast.success('Invoice created successfully');
    }

    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Invoice Details
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Issue Date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                />
                
                <Input
                  type="date"
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Line Items
                </h3>
                <Button size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Item #{index + 1}</h4>
                    {lineItems.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product/Service
                      </label>
                      <select
                        value={item.productId || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            selectProduct(index, e.target.value);
                          } else {
                            updateLineItem(index, 'productId', undefined);
                            updateLineItem(index, 'productName', '');
                            updateLineItem(index, 'price', 0);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select product or enter custom</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ${product.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Custom Product/Service Name"
                      value={item.productName}
                      onChange={(e) => updateLineItem(index, 'productName', e.target.value)}
                      placeholder="Enter product or service name"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Input
                      type="number"
                      label="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                    
                    <Input
                      type="number"
                      label="Price"
                      value={item.price}
                      onChange={(e) => updateLineItem(index, 'price', Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                    
                    <Input
                      type="number"
                      label="Tax %"
                      value={item.taxPercent}
                      onChange={(e) => updateLineItem(index, 'taxPercent', Number(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    
                    <Input
                      type="number"
                      label="Discount %"
                      value={item.discountPercent}
                      onChange={(e) => updateLineItem(index, 'discountPercent', Number(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Line Total
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm font-medium text-gray-900">
                        ${item.lineTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          {formData.customerId && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Customer Info
                </h3>
              </CardHeader>
              <CardContent>
                {(() => {
                  const customer = customers.find(c => c.id === formData.customerId);
                  return customer ? (
                    <div className="space-y-2 text-sm">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-gray-600">{customer.email}</div>
                      <div className="text-gray-600">{customer.phone}</div>
                      <div className="text-gray-600">{customer.address}</div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}

          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Summary
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">-${totals.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${totals.totalTax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">${totals.grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSubmit('draft')}
              variant="secondary"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save as Draft</span>
            </Button>
            
            <Button
              onClick={() => handleSubmit('unpaid')}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save as Unpaid</span>
            </Button>
            
            <Button
              onClick={() => handleSubmit('paid')}
              variant="success"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Mark as Paid</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};