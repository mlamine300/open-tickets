/* eslint-disable @typescript-eslint/no-explicit-any */

import InfoBar from "@/components/main/InfoBar";
import SideBar from "../components/main/SideBar";
import { useEffect } from "react";

const DashboardLayout = ({ children }: { children: any }) => {
  useEffect(() => {
  if (Notification.permission !== "granted") {
    
    Notification.requestPermission();
  }
 
}, []);
  return (
    <section className=" h-full min-h-svh flex flex-row ">
      
      <SideBar  />

      <main  className=" my-24 w-full px-5   flex  h-full layout justify-center ">{children}</main>
      <InfoBar/>
    </section>
  );
};

export default DashboardLayout;
