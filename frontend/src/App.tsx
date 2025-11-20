
import './App.css'
import { Route, Routes } from 'react-router'
import Login from './page/auth/Login'
import SignUp from './page/auth/SignUp'
import { Toaster } from "react-hot-toast";
function App() {
 

  return (
     <div className="layout bg-background-screen">

    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>  
      <Toaster position="top-center" reverseOrder={false} />
     </div>)
}

export default App
