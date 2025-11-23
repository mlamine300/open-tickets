/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from "react-router";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";

const MenuItem = ({
  item,
  choosed,
}: {
  item: {
    id: string;
    label: string;
    icon: any;
    path: string;
  };

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
  // if (item.path === "/logout") {
  //   const LogOut=()=>{

  //   }
  //   return (
  //     <Link  onClick={()=>LogOut()} className="flex flex-row p-2 items-center gap-4 text-lg my-1 cursor-pointer text-text-primary/90">
  //       <Icon className={""} />
  //       <p className="text-sm">{item.label} </p>
  //     </Link>
  //   );
  // }
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
      }`}
    >
      <Icon className={""} />
      <p className="text-sm">{item.label} </p>
    </Link>
  );
};

export default MenuItem;
