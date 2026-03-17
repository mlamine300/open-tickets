import { Outlet, useNavigate } from "react-router-dom";
import Fouter from "../components/main/Fouter";
import Header from "../components/main/Header";
import NotAuthorized from "../components/main/NotAuthorized";
import { useEffect } from "react";
import { tokenService } from "../utils/tokenService";
import DashboardLayout from "@/layouts/DashboardLayout";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = localStorage.getItem("role");
  //const token = localStorage.getItem("token");
  const token = tokenService.getToken();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  
    return (
      <div className="w-full h-full ">
        <Header />
        <DashboardLayout >
       {role && allowedRoles.includes(role)? <Outlet />:<NotAuthorized/>}

        </DashboardLayout>
        <Fouter />
      </div>
    );

 
};

export default PrivateRoute;