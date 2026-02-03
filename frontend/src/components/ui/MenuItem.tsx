/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../data/apiPaths";

const MenuItem = ({
  item,
  choosed,
  colapsed
}: {
  item: {
    id: string;
    label: string;
    icon: any;
    path: string;
   
  };
 colapsed?: boolean;
  choosed: boolean;
}) => {
  const logout = async () => {
    try {
      const data = await axiosInstance.post(API_PATH.AUTH.LOGOUT);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const Icon = item.icon;
  
  return (
    <Link
      onClick={() => {
        if (item.path === "/logout") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          logout();
        }
      }}
      to={item.path === "/logout" ? "/login" : item.path}
      className={`flex flex-row p-2 items-center gap-4 text-lg my-1 cursor-pointer ${
        choosed
          ? "text-primary bg-primary/10 border-r-2 border-primary "
          : "text-text-primary/90"
      } ${item.path === "/logout" ? "mt-auto" : ""}`}
    >
      <Icon className={colapsed?"w-8 h-8":"w-5 h-5"} />
      <p className={colapsed?"hidden":"text-sm"} >{item.label} </p>
    </Link>
  );
};

export default MenuItem;
