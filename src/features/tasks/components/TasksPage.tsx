import { useTasks } from '@/hooks/useTasks';
import { TaskList } from './TaskList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { TaskStatus, TaskPriority, Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TaskModal } from './TaskModal';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { useProjects } from '@/hooks/useProjects';

const statusFilters: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
];

const priorityFilters: { value: TaskPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const { data: projects } = useProjects();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const filteredTasks = tasks?.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  }) ?? [];

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setDeletingTask(task);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">All Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {tasks?.length ?? 0} tasks total
          </p>
        </div>
        <Button 
          className="gap-2 gradient-primary text-primary-foreground shadow-sm hover:shadow-md transition-shadow"
          onClick={() => setIsModalOpen(true)}
          disabled={!projects?.length}
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {!projects?.length && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Create a project first to start adding tasks.
          </p>
        </div>
      )}

      <div className="space-y-3">
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

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {priorityFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={priorityFilter === filter.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPriorityFilter(filter.value)}
              className="shrink-0 text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>
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
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage={
            statusFilter === 'all' && priorityFilter === 'all'
              ? 'No tasks yet. Create your first task to get started.'
              : 'No tasks match your filters'
          }
        />
      )}

      <TaskModal 
        open={isModalOpen} 
        onOpenChange={handleCloseModal}
        task={editingTask}
      />

      <DeleteTaskDialog
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
      />
    </div>
  );
}
