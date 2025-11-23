import { Outlet, useNavigate } from "react-router-dom";
import Fouter from "../components/Fouter";
import Header from "../components/Header";
import NotAuthorized from "../components/NotAuthorized";
import { useEffect } from "react";
import { tokenService } from "../utils/tokenService";

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

  if (role && allowedRoles.includes(role))
    return (
      <div className="w-full h-full ">
        <Header />
        <Outlet />
        <Fouter />
      </div>
    );

  return <NotAuthorized />;
};

export default PrivateRoute;