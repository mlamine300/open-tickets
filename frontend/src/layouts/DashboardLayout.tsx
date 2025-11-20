/* eslint-disable @typescript-eslint/no-explicit-any */

import SideBar from "../components/SideBar";

const DashboardLayout = ({ children }: { children: any }) => {
  return (
    <section className=" h-full min-h-svh flex flex-row ">
      <SideBar />

      <main className=" my-16 w-full px-5   flex  h-full">{children}</main>
    </section>
  );
};

export default DashboardLayout;
