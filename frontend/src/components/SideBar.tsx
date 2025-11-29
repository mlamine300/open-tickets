import { useState } from "react";
import { SIDE_MENU_ADMIN_DATA, SIDE_MENU_USER_DATA } from "../utils/data";
import { useUserContext } from "../context/user/userContext";
import MenuItem from "./MenuItem";
import { useLocation } from "react-router";
import { HiBars3 } from "react-icons/hi2";
import { getColorFromName } from "../utils/helper";
import PopUpMenuItem from "./PopUpMenuItem";
import { Accordion } from "./ui/accordion";

const SideBar = () => {
  const { pathname } = useLocation();
  const isShoosed = (link: string) => {
    return link === pathname;
    // if (link === "/") return link === pathname;
    // return pathname.includes(link);
  };
  const type = localStorage.getItem("role");

  const menuItems =
    type === "admin" ? SIDE_MENU_ADMIN_DATA : SIDE_MENU_USER_DATA;
  const { user } = useUserContext();
  const [showed, setShowed] = useState<boolean>(false);
  return (
    <>
      {/* <button onClick={setShowed((s) => !s)}> */}
      <HiBars3
        className="fixed z-20 left-10  top-5 rounded-full bg-gray-hot/20 p-2 text-primary md:hidden w-8 h-8 active:rotate-30 transition"
        onClick={() => setShowed((b) => !b)}
      />
      {/* </button> */}
      <aside
        onClick={() => setShowed(false)}
        className={`min-h-lvh  bg-background-base transition duration-300 ease-in-out  ${
          showed
            ? "fixed h-full  flex flex-col w-full z-10"
            : "relative  mt-10 hidden md:flex flex-col w-64 border-r gap-10 border-gray-hot "
        }`}
      >
        <div className="flex  flex-col items-center w-64 gap-1 mt-8">
           
            <p
              style={{
                backgroundColor: getColorFromName(user?.name || "user"),
              }}
              className="rounded-full text-background-base w-20 h-20 items-center justify-center flex text-7xl"
            >
              {user?.name.slice(0, 1).toUpperCase()}
            </p>
          
          <p className="text-xs px-2 py-px text-text-accent bg-primary rounded">
            {user?.role}
          </p>
          <p className="font-semibold text-xs">{user?.name} </p>
          <p className="font-light text-gray-500 text-[10px]">{user?.email} </p>
        </div>
        <div>
           <Accordion  type="single" collapsible>
          {menuItems.map((item, index) => {
          if(item.hasChilds){
              return (
              <PopUpMenuItem
                item={item}
                key={index}
                choosed={isShoosed(item.path)}
              />
            );
          }else{
              return (
              <MenuItem
                item={item}
                key={index}
                choosed={isShoosed(item.path)}
              />
            );
          }
          })}
          </Accordion>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
