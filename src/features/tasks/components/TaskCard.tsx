import { Task } from '@/lib/types';
import { cn, formatRelativeDate } from '@/lib/utils';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateTask } from '@/hooks/useTasks';

interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const isDone = task.status === 'done';

  const handleToggle = () => {
    updateTask.mutate({
      id: task.id,
      data: { status: isDone ? 'todo' : 'done' },
    });
  };

  return (
    <Card 
      className={cn(
        'group transition-all duration-200 hover:shadow-card border-border/50 animate-fade-in',
        isDone && 'opacity-60',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={isDone}
            onCheckedChange={handleToggle}
            className="mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className={cn(
                  'text-sm font-medium text-foreground leading-tight',
                  isDone && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </h3>
              <TaskPriorityBadge priority={task.priority} />
            </div>
            {task.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <TaskStatusBadge status={task.status} showLabel={false} />
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
