import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Invoice, Customer, Product, LineItem, Estimate, DeliveryNote } from '../types';
import { mockUser, mockCustomers, mockProducts, mockInvoices, mockEstimates, mockDeliveryNotes } from '../data/mockData';

interface InvoiceStore extends AppState {
  // Auth actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  
  // Estimate actions
  addEstimate: (estimate: Omit<Estimate, 'id' | 'estimateNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateEstimate: (id: string, estimate: Partial<Estimate>) => void;
  deleteEstimate: (id: string) => void;
  getEstimateById: (id: string) => Estimate | undefined;
  
  // Delivery Note actions
  addDeliveryNote: (deliveryNote: Omit<DeliveryNote, 'id' | 'deliveryNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateDeliveryNote: (id: string, deliveryNote: Partial<DeliveryNote>) => void;
  deleteDeliveryNote: (id: string) => void;
  getDeliveryNoteById: (id: string) => DeliveryNote | undefined;
  
  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Utility functions
  generateInvoiceNumber: () => string;
  generateEstimateNumber: () => string;
  generateDeliveryNumber: () => string;
  calculateLineTotal: (lineItem: Omit<LineItem, 'id' | 'lineTotal'>) => number;
  calculateInvoiceTotals: (lineItems: LineItem[]) => {
    subtotal: number;
    totalTax: number;
    totalDiscount: number;
    grandTotal: number;
  };
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      user: null,
      invoices: mockInvoices,
      estimates: mockEstimates,
      deliveryNotes: mockDeliveryNotes,
      customers: mockCustomers,
      products: mockProducts,
      isAuthenticated: false,
      nextInvoiceNumber: 6,
      nextEstimateNumber: 4,
      nextDeliveryNumber: 4,

      login: (email: string, password: string) => {
        // Simple mock authentication
        if (email === 'demo@invoice.com' && password === 'demo123') {
          set({ 
            user: mockUser, 
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      generateInvoiceNumber: () => {
        const state = get();
        const invoiceNumber = `INV-${String(state.nextInvoiceNumber).padStart(3, '0')}`;
        set({ nextInvoiceNumber: state.nextInvoiceNumber + 1 });
        return invoiceNumber;
      },

      generateEstimateNumber: () => {
        const state = get();
        const estimateNumber = `EST-${String(state.nextEstimateNumber).padStart(3, '0')}`;
        set({ nextEstimateNumber: state.nextEstimateNumber + 1 });
        return estimateNumber;
      },

      generateDeliveryNumber: () => {
        const state = get();
        const deliveryNumber = `DN-${String(state.nextDeliveryNumber).padStart(3, '0')}`;
        set({ nextDeliveryNumber: state.nextDeliveryNumber + 1 });
        return deliveryNumber;
      },

      calculateLineTotal: (lineItem) => {
        const { quantity, price, taxPercent, discountPercent } = lineItem;
        const subtotal = quantity * price;
        const discount = subtotal * (discountPercent / 100);
        const afterDiscount = subtotal - discount;
        const tax = afterDiscount * (taxPercent / 100);
        return afterDiscount + tax;
      },

      calculateInvoiceTotals: (lineItems) => {
        const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const totalDiscount = lineItems.reduce((sum, item) => {
          const itemSubtotal = item.quantity * item.price;
          return sum + (itemSubtotal * (item.discountPercent / 100));
        }, 0);
        const totalTax = lineItems.reduce((sum, item) => {
          const itemSubtotal = item.quantity * item.price;
          const itemDiscount = itemSubtotal * (item.discountPercent / 100);
          const itemAfterDiscount = itemSubtotal - itemDiscount;
          return sum + (itemAfterDiscount * (item.taxPercent / 100));
        }, 0);
        const grandTotal = subtotal - totalDiscount + totalTax;

        return {
          subtotal,
          totalTax,
          totalDiscount,
          grandTotal
        };
      },

      addInvoice: (invoiceData) => {
        const state = get();
        const invoiceNumber = state.generateInvoiceNumber();
        const now = new Date().toISOString();
        
        const totals = state.calculateInvoiceTotals(invoiceData.lineItems);
        
        const newInvoice: Invoice = {
          ...invoiceData,
          id: Date.now().toString(),
          invoiceNumber,
          ...totals,
          createdAt: now,
          updatedAt: now
        };

        set({ 
          invoices: [...state.invoices, newInvoice]
        });
      },

      updateInvoice: (id, updateData) => {
        set((state) => {
          const invoices = state.invoices.map(invoice => {
            if (invoice.id === id) {
              const updated = { ...invoice, ...updateData, updatedAt: new Date().toISOString() };
              
              if (updateData.lineItems) {
                const totals = state.calculateInvoiceTotals(updateData.lineItems);
                return { ...updated, ...totals };
              }
              
              return updated;
            }
            return invoice;
          });
          
          return { invoices };
        });
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter(invoice => invoice.id !== id)
        }));
      },

      getInvoiceById: (id) => {
        const state = get();
        return state.invoices.find(invoice => invoice.id === id);
      },

      addEstimate: (estimateData) => {
        const state = get();
        const estimateNumber = state.generateEstimateNumber();
        const now = new Date().toISOString();
        
        const totals = state.calculateInvoiceTotals(estimateData.lineItems);
        
        const newEstimate: Estimate = {
          ...estimateData,
          id: Date.now().toString(),
          estimateNumber,
          ...totals,
          createdAt: now,
          updatedAt: now
        };

        set({ 
          estimates: [...state.estimates, newEstimate]
        });
      },

      updateEstimate: (id, updateData) => {
        set((state) => {
          const estimates = state.estimates.map(estimate => {
            if (estimate.id === id) {
              const updated = { ...estimate, ...updateData, updatedAt: new Date().toISOString() };
              
              if (updateData.lineItems) {
                const totals = state.calculateInvoiceTotals(updateData.lineItems);
                return { ...updated, ...totals };
              }
              
              return updated;
            }
            return estimate;
          });
          
          return { estimates };
        });
      },

      deleteEstimate: (id) => {
        set((state) => ({
          estimates: state.estimates.filter(estimate => estimate.id !== id)
        }));
      },

      getEstimateById: (id) => {
        const state = get();
        return state.estimates.find(estimate => estimate.id === id);
      },

      addDeliveryNote: (deliveryNoteData) => {
        const state = get();
        const deliveryNumber = state.generateDeliveryNumber();
        const now = new Date().toISOString();
        
        const newDeliveryNote: DeliveryNote = {
          ...deliveryNoteData,
          id: Date.now().toString(),
          deliveryNumber,
          createdAt: now,
          updatedAt: now
        };

        set({ 
          deliveryNotes: [...state.deliveryNotes, newDeliveryNote]
        });
      },

      updateDeliveryNote: (id, updateData) => {
        set((state) => {
          const deliveryNotes = state.deliveryNotes.map(deliveryNote => {
            if (deliveryNote.id === id) {
              return { ...deliveryNote, ...updateData, updatedAt: new Date().toISOString() };
            }
            return deliveryNote;
          });
          
          return { deliveryNotes };
        });
      },

      deleteDeliveryNote: (id) => {
        set((state) => ({
          deliveryNotes: state.deliveryNotes.filter(deliveryNote => deliveryNote.id !== id)
        }));
      },

      getDeliveryNoteById: (id) => {
        const state = get();
        return state.deliveryNotes.find(deliveryNote => deliveryNote.id === id);
      },

      addCustomer: (customerData) => {
        set((state) => ({
          customers: [
            ...state.customers,
            {
              ...customerData,
              id: Date.now().toString()
            }
          ]
        }));
      },

      updateCustomer: (id, updateData) => {
        set((state) => ({
          customers: state.customers.map(customer =>
            customer.id === id ? { ...customer, ...updateData } : customer
          )
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter(customer => customer.id !== id)
        }));
      },

      addProduct: (productData) => {
        set((state) => ({
          products: [
            ...state.products,
            {
              ...productData,
              id: Date.now().toString()
            }
          ]
        }));
      },

      updateProduct: (id, updateData) => {
        set((state) => ({
          products: state.products.map(product =>
            product.id === id ? { ...product, ...updateData } : product
          )
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter(product => product.id !== id)
        }));
      }
    }),
    {
      name: 'invoice-store',
      partialize: (state) => ({
        invoices: state.invoices,
        estimates: state.estimates,
        deliveryNotes: state.deliveryNotes,
        customers: state.customers,
        products: state.products,
        nextInvoiceNumber: state.nextInvoiceNumber,
        nextEstimateNumber: state.nextEstimateNumber,
        nextDeliveryNumber: state.nextDeliveryNumber
      })
    }
  )
);