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
  style?: React.CSSProperties;
}

export function StatsCard({ title, value, icon: Icon, trend, className, style }: StatsCardProps) {
  return (
    <div 
      className={cn(
        'p-5 rounded-xl bg-card border border-border/50 transition-all duration-200 hover:shadow-card animate-fade-in',
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          {trend && (
            <p 
              className={cn(
                'mt-1 text-xs font-medium',
                trend.value >= 0 ? 'text-status-done' : 'text-status-blocked'
              )}
            >
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
