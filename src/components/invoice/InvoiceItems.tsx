import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InvoiceItem } from '@/types/invoice';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function InvoiceItems({ items, onChange }: InvoiceItemsProps) {
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    onChange(
      items.map(item => {
        if (item.id !== id) return item;
        
        const updated = { ...item, [field]: value };
        
        // Recalculate total when quantity or price changes
        if (field === 'quantity' || field === 'price') {
          const qty = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'price' ? Number(value) : item.price;
          updated.total = qty * price;
        }
        
        return updated;
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Invoice Items</h3>
        <Button onClick={addItem} size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Table Header */}
      <div className="hidden rounded-t-lg bg-muted/50 p-3 sm:grid sm:grid-cols-12 sm:gap-4">
        <div className="col-span-5">
          <Label className="text-xs font-medium uppercase text-muted-foreground">Item Name</Label>
        </div>
        <div className="col-span-2 text-center">
          <Label className="text-xs font-medium uppercase text-muted-foreground">Qty</Label>
        </div>
        <div className="col-span-2 text-center">
          <Label className="text-xs font-medium uppercase text-muted-foreground">Price</Label>
        </div>
        <div className="col-span-2 text-right">
          <Label className="text-xs font-medium uppercase text-muted-foreground">Total</Label>
        </div>
        <div className="col-span-1" />
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">No items added yet</p>
            <Button onClick={addItem} size="sm" variant="ghost" className="mt-2 gap-2">
              <Plus className="h-4 w-4" />
              Add your first item
            </Button>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'grid gap-3 rounded-lg border border-border/50 p-3 transition-all hover:border-border',
                'sm:grid-cols-12 sm:items-center sm:gap-4',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Item Name */}
              <div className="sm:col-span-5">
                <Label className="mb-1 block text-xs text-muted-foreground sm:hidden">Item Name</Label>
                <Input
                  placeholder="Item description"
                  value={item.name}
                  onChange={e => updateItem(item.id, 'name', e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div className="sm:col-span-2">
                <Label className="mb-1 block text-xs text-muted-foreground sm:hidden">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={item.quantity || ''}
                  onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="text-center"
                />
              </div>

              {/* Price */}
              <div className="sm:col-span-2">
                <Label className="mb-1 block text-xs text-muted-foreground sm:hidden">Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={item.price || ''}
                  onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  className="text-center"
                />
              </div>

              {/* Total */}
              <div className="sm:col-span-2 sm:text-right">
                <Label className="mb-1 block text-xs text-muted-foreground sm:hidden">Total</Label>
                <p className="py-2 font-semibold">{formatCurrency(item.total)}</p>
              </div>

              {/* Delete */}
              <div className="flex justify-end sm:col-span-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
