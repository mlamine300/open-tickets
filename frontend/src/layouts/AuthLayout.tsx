import type { ReactElement } from "react";
import OpenTicketsImage from "../assets/open tickets.png"

const AuthLayout = ({ children }: { children: ReactElement }) => {
  const image=import.meta.env.VITE_LOGO_URL || OpenTicketsImage
  const name=import.meta.env.VITE_APP_NAME ||"Open Tickets"; 
  return (
    <div className="flex flex-row w-full   h-full">
      <div className="w-full  md:w-[60%] h-full flex flex-col justify-around p-10">
        <h4 className="text-5xl my-8 italic text-amber-300">{name}</h4>
        {children}
      </div>
      <div className="hidden md:w-[40%] md:flex items-center  justify-center">
        <img
          src={image}
          alt="auth-side-img"
          className="w-full h-full bg-cover object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
