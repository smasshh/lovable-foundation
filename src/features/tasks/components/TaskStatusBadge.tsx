import { TaskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  showLabel?: boolean;
  className?: string;
}

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle; className: string }> = {
  'todo': {
    label: 'To Do',
    icon: Circle,
    className: 'text-status-todo bg-status-todo/10 border-status-todo/20',
  },
  'in_progress': {
    label: 'In Progress',
    icon: Clock,
    className: 'text-status-progress bg-status-progress/10 border-status-progress/20',
  },
  'completed': {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'text-status-done bg-status-done/10 border-status-done/20',
  },
  'blocked': {
    label: 'Blocked',
    icon: XCircle,
    className: 'text-status-blocked bg-status-blocked/10 border-status-blocked/20',
  },
};

export function TaskStatusBadge({ status, showLabel = true, className }: TaskStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
