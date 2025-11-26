import DashboardLayout from '@/layouts/DashboardLayout';
import { useParams } from 'react-router';

const TicketPage = () => {
    const params=useParams();

  return (
    <DashboardLayout>
      <h1>{params.id}</h1>
    </DashboardLayout>
  );
};

export default TicketPage;