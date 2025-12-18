/* eslint-disable @typescript-eslint/no-explicit-any */

import SideBar from "../components/main/SideBar";

const DashboardLayout = ({ children }: { children: any }) => {
  return (
    <section className=" h-full min-h-svh flex flex-row ">
      <SideBar />

      <main className=" my-24 w-full px-5   flex  h-full layout ">{children}</main>
    </section>
  );
};

export default DashboardLayout;
