
import './App.css'
import { Route, Routes } from 'react-router'
import Login from './page/auth/Login'
import SignUp from './page/auth/SignUp'
import { Toaster } from "react-hot-toast";
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './components/main/NotFound';
import Dashboard from './page/Dashboard';


import TicketsPage from './page/tickets/TicketsPage';
import TicketOverViewPage from './page/tickets/TicketOverViewPage';
import AddTicket from './page/tickets/AddTicket';
import AddFormPage from './page/forms/AddFormPage';
import FormsPages from './page/forms/FormsPage';
import AddTicketFormPage from './page/tickets/AddTicketFormPage';
function App() {
 

  return (
     <div className="layout bg-background-screen">

    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
<Route element={<PrivateRoute allowedRoles={["standard","supervisor", "admin"]} />}>
       <Route path="/" element={<Dashboard />} />
        <Route path="/form" element={<AddTicket />} />
        <Route path="/form/:id" element={<AddTicketFormPage />} />
        <Route path="/tickets/*" element={<TicketsPage />} />
        <Route path="/ticket/:id" element={<TicketOverViewPage />} />
         <Route path="*" element={<NotFound />} />
       </Route>
       <Route element={<PrivateRoute allowedRoles={[ "admin"]} />}>
         <Route path="/forms" element={<FormsPages />} />
         <Route path="/forms/:id" element={<AddFormPage />} />
         </Route>
      </Routes>  
       
      <Toaster position="top-center" reverseOrder={false} />
     </div>)
}

export default App
