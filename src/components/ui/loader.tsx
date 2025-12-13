import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Loader({ size = "md", className, text }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface PageLoaderProps {
  text?: string;
}

export function PageLoader({ text = "Loading..." }: PageLoaderProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-muted" />
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
}

interface FullPageLoaderProps {
  text?: string;
}

export function FullPageLoader({ text }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <PageLoader text={text} />
    </div>
  );
}
