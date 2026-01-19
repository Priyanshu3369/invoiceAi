import { useState, useEffect, useCallback } from 'react';
import { Invoice, DashboardStats } from '@/types/invoice';

const STORAGE_KEY = 'smartinvoice-invoices';

// Generate a unique invoice number
const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Load invoices from localStorage
const loadInvoices = (): Invoice[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    console.error('Failed to load invoices from storage');
    return [];
  }
};

// Save invoices to localStorage
const saveInvoices = (invoices: Invoice[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch {
    console.error('Failed to save invoices to storage');
  }
};

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load invoices on mount
  useEffect(() => {
    const loaded = loadInvoices();
    setInvoices(loaded);
    setIsLoading(false);
    setHasLoaded(true);
  }, []);

  // Save whenever invoices change (only after initial load)
  useEffect(() => {
    if (hasLoaded) {
      saveInvoices(invoices);
    }
  }, [invoices, hasLoaded]);

  // Add a new invoice - reads fresh from storage and saves immediately
  const addInvoice = useCallback((invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      invoiceNumber: generateInvoiceNumber(),
      createdAt: now,
      updatedAt: now,
    };
    
    // Read fresh from storage, add new invoice, and save immediately
    const currentInvoices = loadInvoices();
    const updatedInvoices = [newInvoice, ...currentInvoices];
    saveInvoices(updatedInvoices);
    setInvoices(updatedInvoices);
    
    return newInvoice;
  }, []);

  // Update an existing invoice
  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id 
        ? { ...inv, ...updates, updatedAt: new Date().toISOString() }
        : inv
    ));
  }, []);

  // Delete an invoice
  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }, []);

  // Get a single invoice by ID
  const getInvoice = useCallback((id: string): Invoice | undefined => {
    return invoices.find(inv => inv.id === id);
  }, [invoices]);

  // Calculate dashboard stats
  const getStats = useCallback((): DashboardStats => {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status !== 'paid').length;
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalInvoices,
      totalRevenue,
      paidInvoices,
      pendingInvoices,
    };
  }, [invoices]);

  // Get recent invoices
  const getRecentInvoices = useCallback((limit: number = 5): Invoice[] => {
    return invoices.slice(0, limit);
  }, [invoices]);

  return {
    invoices,
    isLoading,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    getStats,
    getRecentInvoices,
  };
}