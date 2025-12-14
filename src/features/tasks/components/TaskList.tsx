import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  className?: string;
  emptyMessage?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskList({ tasks, className, emptyMessage = 'No tasks yet', onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg 
            className="h-6 w-6 text-muted-foreground" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {tasks.map((task, index) => (
        <div 
          key={task.id}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
