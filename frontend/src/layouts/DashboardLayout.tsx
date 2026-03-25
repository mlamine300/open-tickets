/* eslint-disable @typescript-eslint/no-explicit-any */

import InfoBar from "@/components/main/InfoBar";
import SideBar from "../components/main/SideBar";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { useUserContext } from "@/context/user/userContext";

const DashboardLayout = ({ children }: { children: any }) => {
  const {user}=useUserContext();
 
  useEffect(() => {
  if (Notification.permission !== "granted") {
    
    Notification.requestPermission();
  }
  if(user!==null){
  socket.emit("register",user?.organisation)
  console.log(user)
  }
    

 
}, [user]);
  return (
    <section className=" h-full min-h-svh flex flex-row ">
      
      <SideBar  />

      <main  className=" my-24 w-full px-5   flex  h-full layout justify-center ">{children}</main>
      <InfoBar/>
    </section>
  );
};

export default DashboardLayout;
