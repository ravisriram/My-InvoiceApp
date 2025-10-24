export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  defaultTax: number;
}

export interface LineItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  price: number;
  taxPercent: number;
  discountPercent: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  grandTotal: number;
  status: 'draft' | 'paid' | 'unpaid';
  createdAt: string;
  updatedAt: string;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  customer?: Customer;
  issueDate: string;
  validUntil: string;
  lineItems: LineItem[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryNote {
  id: string;
  deliveryNumber: string;
  customerId: string;
  customer?: Customer;
  deliveryDate: string;
  lineItems: Omit<LineItem, 'price' | 'taxPercent' | 'discountPercent' | 'lineTotal'>[];
  status: 'pending' | 'in_transit' | 'delivered';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  address: string;
  phone: string;
}

export interface AppState {
  user: User | null;
  invoices: Invoice[];
  estimates: Estimate[];
  deliveryNotes: DeliveryNote[];
  customers: Customer[];
  products: Product[];
  isAuthenticated: boolean;
  nextInvoiceNumber: number;
  nextEstimateNumber: number;
  nextDeliveryNumber: number;
}