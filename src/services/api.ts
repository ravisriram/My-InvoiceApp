// Mock API service for demonstration purposes
// In a real application, this would make actual HTTP requests
const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL as string;

import {
  mockInvoices,
  mockEstimates,
  mockDeliveryNotes,
  mockProformaInvoices,
  mockPurchaseOrders,
  mockCreditNotes,
  mockDebitNotes,
  mockGoodsReceivedNotes,
  mockPaymentReceipts,
  mockCustomers,
  mockSuppliers,
  mockProducts,
  mockUser,
} from "../data/mockData";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  getToken() {
    return localStorage.getItem("auth_token");
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid credentials";
        try {
          const errJson = await response.json();
          errorMessage = errJson?.message || errorMessage;
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data?.token) {
        throw new Error("Token missing in response");
      }

      this.setToken(data.token);
      return data;
    } catch (err) {
      console.error("Login API Error:", err);
      throw err;
    }
  }

  async register(userData: any) {
    await delay(500);
    const token = "mock-jwt-token";
    this.setToken(token);
    return { token, user: { ...mockUser, ...userData } };
  }

  // Invoice endpoints
  async getInvoices(params?: {
    status?: string;
    customerId?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const query = new URLSearchParams();

      if (params?.status && params.status !== "all")
        query.append("status", params.status);
      if (params?.customerId) query.append("customerId", params.customerId);
      if (params?.page) query.append("page", String(params.page));
      if (params?.limit) query.append("limit", String(params.limit));

      const response = await fetch(`${baseURL}/invoices/?${query.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`, // if token needed
        },
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch invoices";
        try {
          const errJson = await response.json();
          errorMessage = errJson?.message || errorMessage;
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      return await response.json(); // expects { data: Invoice[], total: number, ... }
    } catch (err) {
      console.error("Fetch Invoices Error:", err);
      throw err;
    }
  }

  async updateInvoice(id: string, invoiceData: any): Promise<any> {
    try {
      const response = await fetch(`${baseURL}/invoices/${id}`, {
        method: "PUT", // ✅ correct method
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        let errorMessage = "Unable to update invoice";
        try {
          const errJson = await response.json();
          errorMessage = errJson?.message || errorMessage;
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Update Invoice API Error:", err);
      throw err;
    }
  }

  async getInvoice(id: string) {
    await delay(200);
    const invoice = mockInvoices.find((inv) => inv.id === id);
    if (!invoice) throw new Error("Invoice not found");
    return invoice;
  }

  async createInvoice(invoiceData: any) {
    await delay(400);
    const newInvoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newInvoice;
  }

  // async updateInvoice(id: string, invoiceData: any) {
  //   await delay(400);
  //   return { ...invoiceData, id, updatedAt: new Date().toISOString() };
  // }

  async deleteInvoice(id: string) {
    await delay(300);
    return {};
  }

  // Estimate endpoints
  async getEstimates() {
    await delay(300);
    return mockEstimates;
  }

  async getEstimate(id: string) {
    await delay(200);
    const estimate = mockEstimates.find((est) => est.id === id);
    if (!estimate) throw new Error("Estimate not found");
    return estimate;
  }

  async createEstimate(estimateData: any) {
    await delay(400);
    const newEstimate = {
      ...estimateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newEstimate;
  }

  async updateEstimate(id: string, estimateData: any) {
    await delay(400);
    return { ...estimateData, id, updatedAt: new Date().toISOString() };
  }

  async deleteEstimate(id: string) {
    await delay(300);
    return {};
  }

  // Customer endpoints
  async getCustomers() {
    try {
      const response = await fetch(`${baseURL}/customers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`, // if token needed
        },
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch customers";
        try {
          const errJson = await response.json();
          errorMessage = errJson?.message || errorMessage;
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      console.error("Fetch Invoices Error:", err);
      throw err;
    }
  }

  async getCustomer(id: string) {
    await delay(200);
    const customer = mockCustomers.find((c) => c.id === id);
    if (!customer) throw new Error("Customer not found");
    return customer;
  }

  async createCustomer(customerData: any) {
    await delay(400);
    return { ...customerData, id: Date.now().toString() };
  }

  async updateCustomer(id: string, customerData: any) {
    await delay(400);
    return { ...customerData, id };
  }

  async deleteCustomer(id: string) {
    await delay(300);
    return {};
  }

  // Product endpoints
  async getProducts() {
    await delay(200);
    return mockProducts;
  }

  async getProduct(id: string) {
    await delay(200);
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async createProduct(productData: any) {
    await delay(400);
    return { ...productData, id: Date.now().toString() };
  }

  async updateProduct(id: string, productData: any) {
    await delay(400);
    return { ...productData, id };
  }

  async deleteProduct(id: string) {
    await delay(300);
    return {};
  }

  // Delivery Note endpoints
  async getDeliveryNotes() {
    await delay(300);
    return mockDeliveryNotes;
  }

  async getDeliveryNote(id: string) {
    await delay(200);
    const deliveryNote = mockDeliveryNotes.find((dn) => dn.id === id);
    if (!deliveryNote) throw new Error("Delivery note not found");
    return deliveryNote;
  }

  async createDeliveryNote(deliveryNoteData: any) {
    await delay(400);
    const newDeliveryNote = {
      ...deliveryNoteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newDeliveryNote;
  }

  async updateDeliveryNote(id: string, deliveryNoteData: any) {
    await delay(400);
    return { ...deliveryNoteData, id, updatedAt: new Date().toISOString() };
  }

  async deleteDeliveryNote(id: string) {
    await delay(300);
    return {};
  }

  // Proforma Invoice endpoints
  async getProformaInvoices() {
    await delay(300);
    return mockProformaInvoices;
  }

  async getProformaInvoice(id: string) {
    await delay(200);
    const proforma = mockProformaInvoices.find((pfi) => pfi.id === id);
    if (!proforma) throw new Error("Proforma invoice not found");
    return proforma;
  }

  async createProformaInvoice(proformaData: any) {
    await delay(400);
    const newProforma = {
      ...proformaData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newProforma;
  }

  async updateProformaInvoice(id: string, proformaData: any) {
    await delay(400);
    return { ...proformaData, id, updatedAt: new Date().toISOString() };
  }

  async deleteProformaInvoice(id: string) {
    await delay(300);
    return {};
  }

  async convertProformaToInvoice(id: string) {
    await delay(500);
    return { message: "Proforma invoice converted to invoice successfully" };
  }

  // Purchase Order endpoints
  async getPurchaseOrders() {
    await delay(300);
    return mockPurchaseOrders;
  }

  async getPurchaseOrder(id: string) {
    await delay(200);
    const po = mockPurchaseOrders.find((po) => po.id === id);
    if (!po) throw new Error("Purchase order not found");
    return po;
  }

  async createPurchaseOrder(poData: any) {
    await delay(400);
    const newPO = {
      ...poData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newPO;
  }

  async updatePurchaseOrder(id: string, poData: any) {
    await delay(400);
    return { ...poData, id, updatedAt: new Date().toISOString() };
  }

  async deletePurchaseOrder(id: string) {
    await delay(300);
    return {};
  }

  // Credit Note endpoints
  async getCreditNotes() {
    await delay(300);
    return mockCreditNotes;
  }

  async getCreditNote(id: string) {
    await delay(200);
    const creditNote = mockCreditNotes.find((cn) => cn.id === id);
    if (!creditNote) throw new Error("Credit note not found");
    return creditNote;
  }

  async createCreditNote(creditNoteData: any) {
    await delay(400);
    const newCreditNote = {
      ...creditNoteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newCreditNote;
  }

  async updateCreditNote(id: string, creditNoteData: any) {
    await delay(400);
    return { ...creditNoteData, id, updatedAt: new Date().toISOString() };
  }

  async deleteCreditNote(id: string) {
    await delay(300);
    return {};
  }

  // Debit Note endpoints
  async getDebitNotes() {
    await delay(300);
    return mockDebitNotes;
  }

  async getDebitNote(id: string) {
    await delay(200);
    const debitNote = mockDebitNotes.find((dn) => dn.id === id);
    if (!debitNote) throw new Error("Debit note not found");
    return debitNote;
  }

  async createDebitNote(debitNoteData: any) {
    await delay(400);
    const newDebitNote = {
      ...debitNoteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newDebitNote;
  }

  async updateDebitNote(id: string, debitNoteData: any) {
    await delay(400);
    return { ...debitNoteData, id, updatedAt: new Date().toISOString() };
  }

  async deleteDebitNote(id: string) {
    await delay(300);
    return {};
  }

  // Goods Received Note endpoints
  async getGoodsReceivedNotes() {
    await delay(300);
    return mockGoodsReceivedNotes;
  }

  async getGoodsReceivedNote(id: string) {
    await delay(200);
    const grn = mockGoodsReceivedNotes.find((g) => g.id === id);
    if (!grn) throw new Error("Goods received note not found");
    return grn;
  }

  async createGoodsReceivedNote(grnData: any) {
    await delay(400);
    const newGRN = {
      ...grnData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newGRN;
  }

  async updateGoodsReceivedNote(id: string, grnData: any) {
    await delay(400);
    return { ...grnData, id, updatedAt: new Date().toISOString() };
  }

  async deleteGoodsReceivedNote(id: string) {
    await delay(300);
    return {};
  }

  // Payment Receipt endpoints
  async getPaymentReceipts() {
    await delay(300);
    return mockPaymentReceipts;
  }

  async getPaymentReceipt(id: string) {
    await delay(200);
    const receipt = mockPaymentReceipts.find((pr) => pr.id === id);
    if (!receipt) throw new Error("Payment receipt not found");
    return receipt;
  }

  async createPaymentReceipt(receiptData: any) {
    await delay(400);
    const newReceipt = {
      ...receiptData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newReceipt;
  }

  async updatePaymentReceipt(id: string, receiptData: any) {
    await delay(400);
    return { ...receiptData, id, updatedAt: new Date().toISOString() };
  }

  async deletePaymentReceipt(id: string) {
    await delay(300);
    return {};
  }

  // Supplier endpoints
  async getSuppliers() {
    await delay(200);
    return mockSuppliers;
  }

  async getSupplier(id: string) {
    await delay(200);
    const supplier = mockSuppliers.find((s) => s.id === id);
    if (!supplier) throw new Error("Supplier not found");
    return supplier;
  }

  async createSupplier(supplierData: any) {
    await delay(400);
    return { ...supplierData, id: Date.now().toString() };
  }

  async updateSupplier(id: string, supplierData: any) {
    await delay(400);
    return { ...supplierData, id };
  }

  async deleteSupplier(id: string) {
    await delay(300);
    return {};
  }

  // Report endpoints
  async getSalesRegister(dateFrom: string, dateTo: string) {
    await delay(400);
    return {
      period: { from: dateFrom, to: dateTo },
      invoices: mockInvoices.filter((inv) => {
        const invDate = new Date(inv.issueDate);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        return invDate >= fromDate && invDate <= toDate;
      }),
      total: 0,
      count: 0,
    };
  }

  async getTaxSummary(dateFrom: string, dateTo: string) {
    await delay(400);
    return {
      period: { from: dateFrom, to: dateTo },
      taxGroups: [],
      totalTaxable: 0,
      totalTax: 0,
    };
  }

  async getCustomerStatement(
    customerId: string,
    dateFrom: string,
    dateTo: string
  ) {
    await delay(400);
    return {
      customerId,
      period: { from: dateFrom, to: dateTo },
      transactions: [],
      openingBalance: 0,
      closingBalance: 0,
    };
  }

  async getAgingReport() {
    await delay(400);
    return {
      asOfDate: new Date().toISOString().split("T")[0],
      agingBuckets: {
        "0-30": { count: 0, amount: 0 },
        "31-60": { count: 0, amount: 0 },
        "61-90": { count: 0, amount: 0 },
        "90+": { count: 0, amount: 0 },
      },
      totalOutstanding: 0,
    };
  }
}

export const apiService = new MockApiService();
