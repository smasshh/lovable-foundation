import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

function Skeleton({ className, animate = true, ...props }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "rounded-lg bg-muted", 
        animate && "animate-shimmer",
        className
      )} 
      {...props} 
    />
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/50 bg-card p-4", className)}>
      <div className="flex items-start gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonList({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonStats({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonList, SkeletonStats };
