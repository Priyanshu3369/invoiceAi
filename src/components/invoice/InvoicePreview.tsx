import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Invoice } from '@/types/invoice';
import { cn } from '@/lib/utils';

interface InvoicePreviewProps {
  invoice: Invoice;
  className?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice, className }, ref) => {
    // Generate UPI payment link for QR code
    const upiLink = `upi://pay?pa=merchant@upi&pn=SmartInvoice&am=${invoice.total}&cu=INR&tn=${invoice.invoiceNumber}`;

    return (
      <div
        ref={ref}
        className={cn(
          'invoice-container bg-white text-gray-900 shadow-xl',
          'max-w-[800px] mx-auto p-8 rounded-xl',
          className
        )}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-indigo-600">
              INVOICE
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {invoice.invoiceNumber}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">SmartInvoice</h2>
            <p className="text-sm text-gray-500">AI-Powered Invoicing</p>
          </div>
        </div>

        {/* Dates & Client Info */}
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Bill To
            </h3>
            <div className="mt-2">
              <p className="font-semibold text-gray-900">{invoice.client.name || 'Client Name'}</p>
              {invoice.client.email && (
                <p className="text-sm text-gray-600">{invoice.client.email}</p>
              )}
              {invoice.client.phone && (
                <p className="text-sm text-gray-600">{invoice.client.phone}</p>
              )}
              {invoice.client.address && (
                <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                  {invoice.client.address}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <div className="flex justify-end gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </span>
                <span className="text-sm text-gray-900">
                  {formatDate(invoice.date)}
                </span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Due Date
                </span>
                <span className="text-sm text-gray-900">
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Qty
                </th>
                <th className="py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Price
                </th>
                <th className="py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 text-sm text-gray-900">{item.name}</td>
                  <td className="py-4 text-center text-sm text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-right text-sm text-gray-600">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-4 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
                <span className="text-green-600">+{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            {invoice.discountRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount ({invoice.discountRate}%)</span>
                <span className="text-red-600">-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code & Notes */}
        <div className="mt-8 flex items-end justify-between border-t border-gray-200 pt-6">
          <div className="flex-1">
            {invoice.notes && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Notes
                </h4>
                <p className="mt-1 text-sm text-gray-600">{invoice.notes}</p>
              </div>
            )}
            <p className="mt-4 text-xs text-gray-400">
              Thank you for your business!
            </p>
          </div>
          <div className="text-center">
            <QRCodeSVG
              value={upiLink}
              size={80}
              level="M"
              className="rounded-lg"
            />
            <p className="mt-1 text-xs text-gray-500">Scan to pay</p>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
