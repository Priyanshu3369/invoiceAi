import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/types/invoice';
import { cn } from '@/lib/utils';

interface RecentInvoicesProps {
  invoices: Invoice[];
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusColor = (status: Invoice['status']) => {
  switch (status) {
    case 'paid':
      return 'bg-success/10 text-success border-success/20';
    case 'sent':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'draft':
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  if (invoices.length === 0) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 font-medium text-foreground">No invoices yet</h3>
            <p className="mb-5 text-sm text-muted-foreground">
              Create your first invoice to get started
            </p>
            <Link to="/create">
              <Button className="font-medium">Create Invoice</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
        <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {invoices.map((invoice, index) => (
            <Link
              key={invoice.id}
              to={`/invoice/${invoice.id}`}
              className={cn(
                'flex items-center justify-between p-4 transition-colors hover:bg-muted/50',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-muted-foreground truncate">{invoice.client.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-medium text-foreground">{formatCurrency(invoice.total)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(invoice.date)}</p>
                </div>
                <Badge variant="outline" className={cn('capitalize font-medium', getStatusColor(invoice.status))}>
                  {invoice.status}
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
