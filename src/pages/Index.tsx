import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/features/dashboard/components/Dashboard';

const Index = () => {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
};

export default Index;
