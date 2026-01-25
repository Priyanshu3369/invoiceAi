import { Link } from 'react-router-dom';
import { Plus, Sparkles, ArrowRight, FileText, Zap, QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { useInvoices } from '@/hooks/useInvoices';

const Index = () => {
  const { getStats, getRecentInvoices, isLoading } = useInvoices();
  const stats = getStats();
  const recentInvoices = getRecentInvoices(5);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Natural language invoice creation',
    },
    {
      icon: QrCode,
      title: 'QR Payments',
      description: 'Instant payment QR codes',
    },
    {
      icon: Download,
      title: 'PDF Export',
      description: 'Professional PDF downloads',
    },
    {
      icon: Zap,
      title: 'Auto Calculate',
      description: 'Tax & discount automation',
    },
  ];

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        {/* Hero Section */}
        <section className="mb-12 lg:mb-16">
          <div className="relative overflow-hidden rounded-2xl bg-secondary border border-border p-8 sm:p-10 lg:p-14">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary blur-3xl" />
              <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI-Powered Invoicing</span>
                </div>
                <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
                  Create Professional Invoices in Seconds
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed lg:text-lg">
                  Just describe your invoice in natural language. Our AI handles the rest-items, tax, discounts, and more.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <Link to="/create">
                  <Button
                    size="lg"
                    className="w-full gap-2 font-medium shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    Create Invoice
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/create">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 font-medium"
                  >
                    <Sparkles className="h-4 w-4" />
                    Try AI Assistant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-12 lg:mb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="card-hover card-elevated animate-fade-in"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        {!isLoading && stats.totalInvoices > 0 && (
          <section className="mb-12 lg:mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Dashboard Overview</h2>
            </div>
            <DashboardStats stats={stats} />
          </section>
        )}

        {/* Recent Invoices */}
        <section>
          <RecentInvoices invoices={recentInvoices} />
        </section>
      </div>
    </Layout>
  );
};

export default Index;