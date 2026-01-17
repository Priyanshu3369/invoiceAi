// Invoice Types for SmartInvoice AI

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  client: ClientInfo;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
}

// AI Parser response type
export interface AIParseResult {
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  taxRate?: number;
  discountRate?: number;
  clientName?: string;
}
