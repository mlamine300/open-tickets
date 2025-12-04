
import { useParams } from 'react-router';

const TicketOverViewPage = () => {
    const params=useParams();

  return (
    
      <h1>{params.id}</h1>
    
  );
};

export default TicketOverViewPage;