import { useTasks } from '@/hooks/useTasks';
import { TaskList } from './TaskList';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useState } from 'react';
import { TaskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusFilters: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' },
];

export function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks?.filter(task => 
    statusFilter === 'all' || task.status === statusFilter
  ) ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">All Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {tasks?.length ?? 0} tasks total
          </p>
        </div>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-sm hover:shadow-md transition-shadow">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={statusFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              'shrink-0 transition-all',
              statusFilter === filter.value 
                ? 'gradient-primary text-primary-foreground border-0'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <TaskList 
          tasks={filteredTasks}
          emptyMessage={
            statusFilter === 'all' 
              ? 'No tasks yet. Create your first task to get started.'
              : `No ${statusFilter.replace('-', ' ')} tasks`
          }
        />
      )}
    </div>
  );
}
