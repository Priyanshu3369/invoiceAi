import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { ClientForm } from '@/components/invoice/ClientForm';
import { InvoiceItems } from '@/components/invoice/InvoiceItems';
import { InvoiceSummary } from '@/components/invoice/InvoiceSummary';
import { AIAssistant } from '@/components/invoice/AIAssistant';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { useInvoices } from '@/hooks/useInvoices';
import { ClientInfo, InvoiceItem, Invoice } from '@/types/invoice';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { addInvoice } = useInvoices();

  // Form state
  const [client, setClient] = useState<ClientInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [taxRate, setTaxRate] = useState(18);
  const [discountRate, setDiscountRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });

  // Calculations
  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discountRate) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxRate) / 100;
    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  }, [items, taxRate, discountRate]);

  // Handle AI result
  const handleAIResult = useCallback(
    (result: {
      items: InvoiceItem[];
      taxRate?: number;
      discountRate?: number;
      clientName?: string;
    }) => {
      if (result.items.length > 0) {
        setItems(result.items);
      }
      if (result.taxRate !== undefined) {
        setTaxRate(result.taxRate);
      }
      if (result.discountRate !== undefined) {
        setDiscountRate(result.discountRate);
      }
      if (result.clientName) {
        setClient(prev => ({ ...prev, name: result.clientName! }));
      }
    },
    []
  );

  // Preview invoice object
  const previewInvoice: Invoice = useMemo(
    () => ({
      id: 'preview',
      invoiceNumber: 'INV-PREVIEW',
      date: new Date().toISOString(),
      dueDate,
      client,
      items,
      subtotal: calculations.subtotal,
      taxRate,
      taxAmount: calculations.taxAmount,
      discountRate,
      discountAmount: calculations.discountAmount,
      total: calculations.total,
      status: 'draft',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [client, items, taxRate, discountRate, notes, dueDate, calculations]
  );

  // Save invoice
  const handleSave = () => {
    // Validation
    if (!client.name.trim()) {
      toast.error('Please enter a client name');
      return;
    }
    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }
    if (items.some(item => !item.name.trim())) {
      toast.error('Please enter a name for all items');
      return;
    }

    const invoice = addInvoice({
      date: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      client,
      items,
      subtotal: calculations.subtotal,
      taxRate,
      taxAmount: calculations.taxAmount,
      discountRate,
      discountAmount: calculations.discountAmount,
      total: calculations.total,
      status: 'draft',
      notes,
    });

    toast.success('Invoice created successfully!');
    navigate(`/invoice/${invoice.id}`);
  };

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create Invoice</h1>
              <p className="text-sm text-muted-foreground">
                Fill in the details or use AI to generate
              </p>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2 font-medium">
            <Save className="h-4 w-4" />
            Save Invoice
          </Button>
        </div>

        <Tabs defaultValue="edit" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary">
            <TabsTrigger value="edit" className="gap-2 font-medium data-[state=active]:bg-background">
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2 font-medium data-[state=active]:bg-background">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - AI Assistant */}
              <div className="lg:col-span-1">
                <AIAssistant onApplyResult={handleAIResult} />
              </div>

              {/* Right Column - Form */}
              <div className="space-y-6 lg:col-span-2">
                {/* Client & Dates */}
                <Card className="card-elevated">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <ClientForm client={client} onChange={setClient} />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Invoice Date</Label>
                          <Input
                            type="date"
                            value={new Date().toISOString().split('T')[0]}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Due Date</Label>
                          <Input
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Items */}
                <Card className="card-elevated">
                  <CardContent className="pt-6">
                    <InvoiceItems items={items} onChange={setItems} />
                  </CardContent>
                </Card>

                {/* Summary & Notes */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Additional notes or payment instructions..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </CardContent>
                  </Card>

                  <InvoiceSummary
                    subtotal={calculations.subtotal}
                    taxRate={taxRate}
                    taxAmount={calculations.taxAmount}
                    discountRate={discountRate}
                    discountAmount={calculations.discountAmount}
                    total={calculations.total}
                    onTaxRateChange={setTaxRate}
                    onDiscountRateChange={setDiscountRate}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <div className="flex justify-center">
              <InvoicePreview invoice={previewInvoice} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CreateInvoice;
