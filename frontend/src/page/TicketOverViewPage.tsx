import DashboardLayout from '@/layouts/DashboardLayout';
import { useParams } from 'react-router';

const TicketOverViewPage = () => {
    const params=useParams();

  return (
    <DashboardLayout>
      <h1>{params.id}</h1>
    </DashboardLayout>
  );
};

export default TicketOverViewPage;