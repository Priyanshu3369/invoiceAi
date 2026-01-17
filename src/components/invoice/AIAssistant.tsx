import { useState } from 'react';
import { Sparkles, Send, Loader2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIParseResult, InvoiceItem } from '@/types/invoice';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AIAssistantProps {
  onApplyResult: (result: {
    items: InvoiceItem[];
    taxRate?: number;
    discountRate?: number;
    clientName?: string;
  }) => void;
}

const examplePrompts = [
  "Create invoice for 2 monitors at ₹12000 each with 18% GST and 10% discount",
  "Add 5 keyboards at 2500 rupees and 3 mice at 800 rupees with 12% tax",
  "Invoice for web development 50 hours at 1500/hr, 18% GST, client: Acme Corp",
];

export function AIAssistant({ onApplyResult }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const parseWithAI = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-invoice', {
        body: { prompt: prompt.trim() },
      });

      if (error) {
        // Handle rate limit and payment errors
        if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
          toast.error('Rate limit exceeded. Please try again in a moment.');
        } else if (error.message?.includes('402') || error.message?.includes('Payment')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        } else {
          throw error;
        }
        return;
      }

      if (data && data.items) {
        // Convert parsed items to InvoiceItem format
        const items: InvoiceItem[] = data.items.map((item: { name: string; quantity: number; price: number }) => ({
          id: uuidv4(),
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        }));

        onApplyResult({
          items,
          taxRate: data.taxRate,
          discountRate: data.discountRate,
          clientName: data.clientName,
        });

        toast.success('Invoice items extracted successfully!');
        setPrompt('');
      } else {
        toast.error('Could not parse invoice details. Please try a clearer description.');
      }
    } catch (error) {
      console.error('AI parsing error:', error);
      toast.error('Failed to parse. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      parseWithAI();
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          AI Invoice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Describe your invoice in natural language and let AI fill in the details.
        </p>

        {/* Example prompts */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lightbulb className="h-3 w-3" />
            <span>Try these examples:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              >
                {example.slice(0, 35)}...
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="relative">
          <Textarea
            placeholder="E.g., Create invoice for 2 laptops at 45000 each, 18% GST, 5% discount for Acme Corp"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="pr-12 resize-none"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={parseWithAI}
            disabled={isLoading || !prompt.trim()}
            className="absolute bottom-2 right-2 h-8 w-8"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Press <kbd className="rounded bg-muted px-1">⌘</kbd>+<kbd className="rounded bg-muted px-1">Enter</kbd> to generate
        </p>
      </CardContent>
    </Card>
  );
}
