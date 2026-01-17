import { useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Check, Trash2, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Layout } from '@/components/layout/Layout';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { useInvoices } from '@/hooks/useInvoices';
import { Invoice } from '@/types/invoice';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { cn } from '@/lib/utils';

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

const ViewInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const invoice = id ? getInvoice(id) : undefined;

  if (!invoice) {
    return (
      <Layout>
        <div className="container flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Invoice Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The invoice you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/" className="mt-6">
            <Button className="font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Export to PDF
  const handleExportPDF = async () => {
    if (!invoiceRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Print invoice
  const handlePrint = () => {
    window.print();
  };

  // Mark as paid
  const handleMarkPaid = () => {
    updateInvoice(invoice.id, { status: 'paid' });
    toast.success('Invoice marked as paid!');
  };

  // Delete invoice
  const handleDelete = () => {
    deleteInvoice(invoice.id);
    toast.success('Invoice deleted');
    navigate('/');
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 no-print sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {invoice.invoiceNumber}
                </h1>
                <Badge
                  variant="outline"
                  className={cn('capitalize font-medium', getStatusColor(invoice.status))}
                >
                  {invoice.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {invoice.status !== 'paid' && (
              <Button
                variant="outline"
                onClick={handleMarkPaid}
                className="gap-2 font-medium"
              >
                <Check className="h-4 w-4" />
                Mark as Paid
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2 font-medium"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>

            <Button onClick={handleExportPDF} className="gap-2 font-medium" disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export PDF
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Edit className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={e => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Invoice
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete invoice {invoice.invoiceNumber}.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="flex justify-center">
          <InvoicePreview ref={invoiceRef} invoice={invoice} />
        </div>
      </div>
    </Layout>
  );
};

export default ViewInvoice;
