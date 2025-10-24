import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoiceStore } from '../../store/useInvoiceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Calendar,
  User,
  Package,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DeliveryLineItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
}

export const DeliveryNoteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    customers, 
    products, 
    addDeliveryNote, 
    updateDeliveryNote, 
    getDeliveryNoteById
  } = useInvoiceStore();

  const isEditing = Boolean(id);
  const existingDeliveryNote = id ? getDeliveryNoteById(id) : null;

  const [formData, setFormData] = useState({
    customerId: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    status: 'pending' as 'pending' | 'in_transit' | 'delivered',
    notes: ''
  });

  const [lineItems, setLineItems] = useState<DeliveryLineItem[]>([
    {
      id: Date.now().toString(),
      productName: '',
      quantity: 1
    }
  ]);

  useEffect(() => {
    if (existingDeliveryNote) {
      setFormData({
        customerId: existingDeliveryNote.customerId,
        deliveryDate: existingDeliveryNote.deliveryDate,
        status: existingDeliveryNote.status,
        notes: existingDeliveryNote.notes || ''
      });
      setLineItems(existingDeliveryNote.lineItems);
    }
  }, [existingDeliveryNote]);

  const updateLineItem = (index: number, field: keyof DeliveryLineItem, value: any) => {
    setLineItems(items => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const addLineItem = () => {
    setLineItems(items => [
      ...items,
      {
        id: Date.now().toString(),
        productName: '',
        quantity: 1
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
    }
  };

  const handleSubmit = (status: 'pending' | 'in_transit' | 'delivered') => {
    if (!formData.customerId) {
      toast.error('Please select a customer');
      return;
    }

    if (lineItems.some(item => !item.productName || item.quantity <= 0)) {
      toast.error('Please fill in all line items correctly');
      return;
    }

    const deliveryNoteData = {
      ...formData,
      lineItems,
      status
    };

    if (isEditing && id) {
      updateDeliveryNote(id, deliveryNoteData);
      toast.success('Delivery note updated successfully');
    } else {
      addDeliveryNote(deliveryNoteData);
      toast.success('Delivery note created successfully');
    }

    navigate('/delivery-notes');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/delivery-notes')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Delivery Note' : 'Create New Delivery Note'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Details */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Delivery Details
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
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <Input
                type="date"
                label="Delivery Date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional delivery notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Items to Deliver
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
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select product or enter custom</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                      min="0"
                      step="1"
                    />
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

          {/* Delivery Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-600" />
                Delivery Summary
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{lineItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Quantity:</span>
                <span className="font-medium">{lineItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Date:</span>
                <span className="font-medium">{new Date(formData.deliveryDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSubmit('pending')}
              variant="secondary"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save as Pending</span>
            </Button>
            
            <Button
              onClick={() => handleSubmit('in_transit')}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Truck className="h-4 w-4" />
              <span>Mark In Transit</span>
            </Button>
            
            <Button
              onClick={() => handleSubmit('delivered')}
              variant="success"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Mark as Delivered</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};