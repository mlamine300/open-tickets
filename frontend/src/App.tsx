
import './App.css'
import { Route, Routes } from 'react-router'
import Login from './page/auth/Login'
// import SignUp from './page/auth/SignUp'
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
import UsersPage from './page/users/UsersPage';
import AddEditUserPage from './page/users/AddEditUserPage';
import AlertPage from './page/alert/AlertPage';
import OrganisationsPage from './page/organisations/OrganisationsPage';
import AddOrganisation from './page/organisations/AddOrganisation';
import Motifpage from './page/motifs/MotifPage';
import SearchPage from './page/search/SearchPage';
import { socket } from './utils/socket';
function App() {
   const favicon = document.querySelector("link[rel='icon']") as any;
   const imageIcon=import.meta.env.VITE_MINI_LOGO;
 if(favicon) favicon.href = imageIcon


const showNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: imageIcon,
      
      // image: "/preview.png", // big preview (Chrome)
      // tag: "chat-message", // prevent spam duplicates
      // // renotify: true,
      // requireInteraction: false, // true = stays until user clicks
    });
  }
};



 

   socket.on('notify', (msg: any) => {
      
      showNotification(msg.title||"Notification",`message : ${msg.message}`)
    });
    



  return (
     <main className="layout bg-background-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route element={<PrivateRoute allowedRoles={["standard","supervisor", "admin"]} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/form" element={<AddTicket />} />
        <Route path="/form/:id" element={<AddTicketFormPage />} />
        <Route path="/tickets/*" element={<TicketsPage />} />
          <Route path="/search" element={<SearchPage />} />
        <Route path="/ticket/:id" element={<TicketOverViewPage />} />
         <Route path="*" element={<NotFound />} />
       </Route>
       <Route element={<PrivateRoute allowedRoles={[ "admin"]} />}>
         <Route path="/forms/list" element={<FormsPages />} />
         <Route path="/forms/:id" element={<AddFormPage />} />
          <Route path="/users/list" element={<UsersPage />} />
         <Route path="/users/:id" element={<AddEditUserPage />} />
         <Route path="/organisations/list" element={<OrganisationsPage />} />
         <Route path="/organisations/:id" element={<AddOrganisation />} />
          <Route path="/motifs" element={<Motifpage />} />
           <Route path="/alert" element={<AlertPage />} />
         </Route>
      </Routes>  
       
      <Toaster position="top-center" reverseOrder={false} />
     </main>)
}

export default App
