import { Task } from '@/lib/types';
import { cn, formatRelativeDate } from '@/lib/utils';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  className?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskCard({ task, className, onEdit, onDelete }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const isCompleted = task.status === 'completed';

  const handleToggle = () => {
    updateTask.mutate({
      id: task.id,
      data: { status: isCompleted ? 'todo' : 'completed' },
    });
  };

  return (
    <Card 
      className={cn(
        'group transition-all duration-200 border-border/50 hover:border-border hover:shadow-premium animate-slide-up',
        isCompleted && 'opacity-60',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <Checkbox 
              checked={isCompleted}
              onCheckedChange={handleToggle}
              className="border-2 data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className={cn(
                  'text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors',
                  isCompleted && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-1">
                <TaskPriorityBadge priority={task.priority} />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => onEdit(task)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 hover:text-destructive"
                      onClick={() => onDelete(task)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {task.description && (
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <TaskStatusBadge status={task.status} />
              {task.dueDate && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(task.dueDate, 'MMM d, yyyy')}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">
                {formatRelativeDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
