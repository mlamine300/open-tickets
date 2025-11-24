
import './App.css'
import { Route, Routes } from 'react-router'
import Login from './page/auth/Login'
import SignUp from './page/auth/SignUp'
import { Toaster } from "react-hot-toast";
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './components/NotFound';
import Dashboard from './page/Dashboard';
import FormPage from './page/FormPage';
import TicketPage from './page/TicketPage';
function App() {
 

  return (
     <div className="layout bg-background-screen">

    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
<Route element={<PrivateRoute allowedRoles={["standard","supervisor", "admin"]} />}>
       <Route path="/form" element={<Dashboard />} />
       
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/tickets" element={<TicketPage />} />
       </Route>
         <Route path="*" element={<NotFound />} />
      </Routes>  
       
      <Toaster position="top-center" reverseOrder={false} />
     </div>)
}

export default App
