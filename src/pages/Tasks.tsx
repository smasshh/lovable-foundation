import { AppLayout } from '@/components/layout/AppLayout';
import { TasksPage } from '@/features/tasks/components/TasksPage';

const Tasks = () => {
  return (
    <AppLayout>
      <TasksPage />
    </AppLayout>
  );
};

export default Tasks;
