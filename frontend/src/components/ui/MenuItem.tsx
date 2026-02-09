/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../data/apiPaths";

const MenuItem = ({
  item,
  choosed,
  colapsed,
  count
}: {
  item: {
    id: string;
    label: string;
    icon: any;
    path: string;
    
   
  };
  count:number|null;
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
      <div className={colapsed?"hidden":"flex justify-between w-full"}>
        <p className={"text-sm"} >{item.label} </p>
        {count&& <p className="text-primary text-sm font-bold italic">{count}</p>}
      </div>
    </Link>
  );
};

export default MenuItem;
