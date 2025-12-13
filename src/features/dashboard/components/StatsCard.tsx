import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div 
      className={cn(
        'group p-5 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:shadow-premium hover:border-border animate-slide-up hover-lift',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground tracking-tight">{value}</p>
          {trend && (
            <p 
              className={cn(
                'mt-2 text-xs font-medium flex items-center gap-1',
                trend.value >= 0 ? 'text-success' : 'text-destructive'
              )}
            >
              <span className={cn(
                'inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-transparent',
                trend.value >= 0 ? 'border-b-success' : 'border-b-destructive rotate-180'
              )} />
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
