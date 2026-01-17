import { FileText, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats as Stats } from '@/types/invoice';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  stats: Stats;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      icon: FileText,
      iconBg: 'bg-secondary',
      iconColor: 'text-foreground',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      title: 'Paid Invoices',
      value: stats.paidInvoices.toString(),
      icon: CheckCircle,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      title: 'Pending',
      value: stats.pendingInvoices.toString(),
      icon: Clock,
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title} 
            className="card-hover card-elevated animate-fade-in"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', stat.iconBg)}>
                <Icon className={cn('h-5 w-5', stat.iconColor)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-semibold tracking-tight text-foreground truncate">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
