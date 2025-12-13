import { CheckSquare, Clock, Target, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { TaskList } from '@/features/tasks/components/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SkeletonStats, SkeletonList } from '@/components/ui/skeleton';

export function Dashboard() {
  const { data: tasks, isLoading } = useTasks();

  const stats = {
    total: tasks?.length ?? 0,
    inProgress: tasks?.filter(t => t.status === 'in-progress').length ?? 0,
    completed: tasks?.filter(t => t.status === 'done').length ?? 0,
    highPriority: tasks?.filter(t => t.priority === 'high').length ?? 0,
  };

  const recentTasks = tasks?.slice(0, 5) ?? [];

  return (
    <div className="space-y-8 max-w-6xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your tasks and projects</p>
        </div>
        <Button className="gap-2 shadow-glow hover:shadow-glow-strong transition-shadow" size="lg">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {isLoading ? (
        <SkeletonStats count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tasks"
            value={stats.total}
            icon={CheckSquare}
            className="stagger-1"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            trend={{ value: 12, label: 'this week' }}
            className="stagger-2"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={Target}
            trend={{ value: 8, label: 'this week' }}
            className="stagger-3"
          />
          <StatsCard
            title="High Priority"
            value={stats.highPriority}
            icon={TrendingUp}
            className="stagger-4"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Recent Tasks</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View all
          </Button>
        </div>
        
        {isLoading ? (
          <SkeletonList count={3} />
        ) : (
          <TaskList 
            tasks={recentTasks}
            emptyMessage="No tasks yet. Create your first task to get started."
          />
        )}
      </div>
    </div>
  );
}
