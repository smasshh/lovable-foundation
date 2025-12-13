import { TaskPriority } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  showLabel?: boolean;
  className?: string;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  'high': {
    label: 'High',
    className: 'text-priority-high',
  },
  'medium': {
    label: 'Medium',
    className: 'text-priority-medium',
  },
  'low': {
    label: 'Low',
    className: 'text-priority-low',
  },
};

export function TaskPriorityBadge({ priority, showLabel = false, className }: TaskPriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      <Flag className="h-3 w-3 fill-current" />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
