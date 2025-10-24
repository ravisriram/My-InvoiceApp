import { Customer, Product, Invoice, User } from '../types';
import type { Estimate, DeliveryNote } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'John Smith',
  email: 'john@company.com',
  company: 'Smith & Associates',
  address: '123 Business St, Suite 100, City, State 12345',
  phone: '+1 (555) 123-4567'
};

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '+1 (555) 987-6543',
    address: '456 Corporate Blvd, Business City, BC 67890'
  },
  {
    id: '2',
    name: 'Tech Innovators LLC',
    email: 'accounts@techinnovators.com',
    phone: '+1 (555) 456-7890',
    address: '789 Innovation Drive, Tech Valley, TV 13579'
  },
  {
    id: '3',
    name: 'Global Solutions Inc',
    email: 'finance@globalsolutions.com',
    phone: '+1 (555) 321-0987',
    address: '321 Solutions Way, Global City, GC 24680'
  },
  {
    id: '4',
    name: 'Creative Design Studio',
    email: 'billing@creativedesign.com',
    phone: '+1 (555) 654-3210',
    address: '654 Design Lane, Art District, AD 97531'
  },
  {
    id: '5',
    name: 'Premium Services Group',
    email: 'payments@premiumservices.com',
    phone: '+1 (555) 789-0123',
    address: '987 Premium Plaza, Service Center, SC 86420'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Web Development',
    price: 125.00,
    defaultTax: 10
  },
  {
    id: '2',
    name: 'UI/UX Design',
    price: 95.00,
    defaultTax: 10
  },
  {
    id: '3',
    name: 'Consulting Services',
    price: 150.00,
    defaultTax: 10
  },
  {
    id: '4',
    name: 'Mobile App Development',
    price: 140.00,
    defaultTax: 10
  },
  {
    id: '5',
    name: 'Digital Marketing',
    price: 85.00,
    defaultTax: 10
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    customerId: '1',
    issueDate: '2024-12-01',
    dueDate: '2024-12-31',
    lineItems: [
      {
        id: '1',
        productId: '1',
        productName: 'Web Development',
        quantity: 40,
        price: 125.00,
        taxPercent: 10,
        discountPercent: 0,
        lineTotal: 5500.00
      },
      {
        id: '2',
        productId: '2',
        productName: 'UI/UX Design',
        quantity: 20,
        price: 95.00,
        taxPercent: 10,
        discountPercent: 5,
        lineTotal: 2090.00
      }
    ],
    subtotal: 7400.00,
    totalTax: 759.00,
    totalDiscount: 95.00,
    grandTotal: 8064.00,
    status: 'paid',
    createdAt: '2024-12-01T08:00:00Z',
    updatedAt: '2024-12-01T08:00:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    customerId: '2',
    issueDate: '2024-12-05',
    dueDate: '2025-01-05',
    lineItems: [
      {
        id: '3',
        productId: '3',
        productName: 'Consulting Services',
        quantity: 16,
        price: 150.00,
        taxPercent: 10,
        discountPercent: 0,
        lineTotal: 2640.00
      }
    ],
    subtotal: 2400.00,
    totalTax: 240.00,
    totalDiscount: 0.00,
    grandTotal: 2640.00,
    status: 'unpaid',
    createdAt: '2024-12-05T09:30:00Z',
    updatedAt: '2024-12-05T09:30:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    customerId: '3',
    issueDate: '2024-12-10',
    dueDate: '2025-01-10',
    lineItems: [
      {
        id: '4',
        productId: '4',
        productName: 'Mobile App Development',
        quantity: 60,
        price: 140.00,
        taxPercent: 10,
        discountPercent: 10,
        lineTotal: 8316.00
      }
    ],
    subtotal: 8400.00,
    totalTax: 756.00,
    totalDiscount: 840.00,
    grandTotal: 8316.00,
    status: 'unpaid',
    createdAt: '2024-12-10T14:15:00Z',
    updatedAt: '2024-12-10T14:15:00Z'
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    customerId: '4',
    issueDate: '2024-12-15',
    dueDate: '2025-01-15',
    lineItems: [
      {
        id: '5',
        productId: '2',
        productName: 'UI/UX Design',
        quantity: 12,
        price: 95.00,
        taxPercent: 10,
        discountPercent: 0,
        lineTotal: 1254.00
      },
      {
        id: '6',
        productId: '5',
        productName: 'Digital Marketing',
        quantity: 8,
        price: 85.00,
        taxPercent: 10,
        discountPercent: 0,
        lineTotal: 748.00
      }
    ],
    subtotal: 1820.00,
    totalTax: 182.00,
    totalDiscount: 0.00,
    grandTotal: 2002.00,
    status: 'draft',
    createdAt: '2024-12-15T11:45:00Z',
    updatedAt: '2024-12-15T11:45:00Z'
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    customerId: '5',
    issueDate: '2024-12-18',
    dueDate: '2025-01-18',
    lineItems: [
      {
        id: '7',
        productId: '1',
        productName: 'Web Development',
        quantity: 24,
        price: 125.00,
        taxPercent: 10,
        discountPercent: 5,
        lineTotal: 3135.00
      }
    ],
    subtotal: 3000.00,
    totalTax: 285.00,
    totalDiscount: 150.00,
    grandTotal: 3135.00,
    status: 'unpaid',
    createdAt: '2024-12-18T16:20:00Z',
    updatedAt: '2024-12-18T16:20:00Z'
  }
];

export const mockEstimates: Estimate[] = [
  {
    id: '1',
    estimateNumber: 'EST-001',
    customerId: '1',
    issueDate: '2024-11-15',
    validUntil: '2024-12-15',
    lineItems: [
      {
        id: '1',
        productId: '1',
        productName: 'Web Development',
        quantity: 50,
        price: 125.00,
        taxPercent: 10,
        discountPercent: 0,
        lineTotal: 6875.00
      }
    ],
    subtotal: 6250.00,
    totalTax: 625.00,
    totalDiscount: 0.00,
    grandTotal: 6875.00,
    status: 'sent',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z'
  },
  {
    id: '2',
    estimateNumber: 'EST-002',
    customerId: '2',
    issueDate: '2024-11-20',
    validUntil: '2024-12-20',
    lineItems: [
      {
        id: '2',
        productId: '2',
        productName: 'UI/UX Design',
        quantity: 30,
        price: 95.00,
        taxPercent: 10,
        discountPercent: 10,
        lineTotal: 2821.50
      }
    ],
    subtotal: 2850.00,
    totalTax: 256.50,
    totalDiscount: 285.00,
    grandTotal: 2821.50,
    status: 'accepted',
    createdAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-11-20T14:30:00Z'
  },
  {
    id: '3',
    estimateNumber: 'EST-003',
    customerId: '3',
    issueDate: '2024-12-01',
    validUntil: '2025-01-01',
    lineItems: [
      {
        id: '3',
        productId: '4',
        productName: 'Mobile App Development',
        quantity: 80,
        price: 140.00,
        taxPercent: 10,
        discountPercent: 5,
        lineTotal: 11704.00
      }
    ],
    subtotal: 11200.00,
    totalTax: 1064.00,
    totalDiscount: 560.00,
    grandTotal: 11704.00,
    status: 'draft',
    createdAt: '2024-12-01T09:15:00Z',
    updatedAt: '2024-12-01T09:15:00Z'
  }
];

export const mockDeliveryNotes: DeliveryNote[] = [
  {
    id: '1',
    deliveryNumber: 'DN-001',
    customerId: '1',
    deliveryDate: '2024-12-20',
    lineItems: [
      {
        id: '1',
        productId: '1',
        productName: 'Web Development Project Files',
        quantity: 1
      },
      {
        id: '2',
        productId: '2',
        productName: 'Design Assets Package',
        quantity: 1
      }
    ],
    status: 'delivered',
    notes: 'Delivered to main office reception. Signed by John Doe.',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T15:30:00Z'
  },
  {
    id: '2',
    deliveryNumber: 'DN-002',
    customerId: '2',
    deliveryDate: '2024-12-22',
    lineItems: [
      {
        id: '3',
        productId: '3',
        productName: 'Consulting Report',
        quantity: 3
      }
    ],
    status: 'in_transit',
    notes: 'Package dispatched via courier service.',
    createdAt: '2024-12-22T08:00:00Z',
    updatedAt: '2024-12-22T08:00:00Z'
  },
  {
    id: '3',
    deliveryNumber: 'DN-003',
    customerId: '4',
    deliveryDate: '2024-12-25',
    lineItems: [
      {
        id: '4',
        productId: '5',
        productName: 'Marketing Materials',
        quantity: 5
      }
    ],
    status: 'pending',
    notes: 'Scheduled for delivery on Christmas day.',
    createdAt: '2024-12-23T12:00:00Z',
    updatedAt: '2024-12-23T12:00:00Z'
  }
];