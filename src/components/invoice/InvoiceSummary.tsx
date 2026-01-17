import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InvoiceSummaryProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  onTaxRateChange: (rate: number) => void;
  onDiscountRateChange: (rate: number) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function InvoiceSummary({
  subtotal,
  taxRate,
  taxAmount,
  discountRate,
  discountAmount,
  total,
  onTaxRateChange,
  onDiscountRateChange,
}: InvoiceSummaryProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4">
      <h3 className="font-semibold">Invoice Summary</h3>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tax (GST/VAT)</span>
            <div className="flex w-20 items-center gap-1">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={taxRate || ''}
                onChange={e => onTaxRateChange(parseFloat(e.target.value) || 0)}
                className="h-8 text-center text-sm"
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <span className="font-medium text-success">+{formatCurrency(taxAmount)}</span>
        </div>

        {/* Discount */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Discount</span>
            <div className="flex w-20 items-center gap-1">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={discountRate || ''}
                onChange={e => onDiscountRateChange(parseFloat(e.target.value) || 0)}
                className="h-8 text-center text-sm"
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <span className="font-medium text-destructive">-{formatCurrency(discountAmount)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
