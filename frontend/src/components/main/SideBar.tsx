import { useEffect, useState } from "react";
import { SIDE_MENU_ADMIN_DATA, SIDE_MENU_USER_DATA } from "../../data/data";
import { useUserContext } from "../../context/user/userContext";
import MenuItem from "../ui/MenuItem";
import { useLocation } from "react-router";
import { HiBars3 } from "react-icons/hi2";

import PopUpMenuItem from "../ui/PopUpMenuItem";
import { Accordion } from "../ui/accordion";
import { getColorFromName } from "../../utils/helper";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { getTicketsStats } from "@/actions/ticketAction";
import SearchMenuForSideBar from "./SearchMenuForSideBar";


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
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const {triggerAppRender}=useUserContext();
  const [triggerSideBarRender,setTriggerSideBarRender]=useState(0);
  const [stats, setStats] = useState<any|null>(null);

  const statsArray=[{
    path:"/tickets",
    value:stats?.received?.total??0,
  },
  {
    path:"/tickets/pending",
    value:stats?.received?.pending??0,
  },
   {
    path:"/tickets/open",
    value:stats?.received?.open??0,
  },
 {
    path:"/tickets/open_me",
    value:stats?.received?.open_me??0,
  },
   {
    path:"/tickets/traited",
    value:stats?.received?.traited??0,
  },
  {
    path:"/tickets/close",
    value:stats?.received?.complete??0,
  },

  {
    path:"/tickets/sent",
    value:stats?.sent?.total??0,
  },
  {
    path:"/tickets/sent/pending",
    value:stats?.sent?.pending??0,
  },
{
    path:"/tickets/sent/open",
    value:stats?.sent?.open??0,
  },
{
    path:"/tickets/sent/traited",
    value:stats?.sent?.traited??0,
  },
{
    path:"/tickets/sent/close",
    value:stats?.sent?.complete??0,
  },

];


  useEffect(() => {
        let intervalId;
        
        const getStats = async () => {
         const fetchedStat=await getTicketsStats();
         
         if(fetchedStat)
         {
       
           setStats(fetchedStat);
          
         }
        };
       
        getStats();
       
        intervalId = setInterval(() => {
          setTriggerSideBarRender(Math.random());
        }, 5*60*1000); // 5 minute
        return () => {
          clearInterval(intervalId);
        };
      }, [triggerAppRender,triggerSideBarRender]);
  
  return (
    <>
      {/* <button onClick={setShowed((s) => !s)}> */}
      <HiBars3
        className="fixed z-20 left-2  top-6 rounded-full bg-gray-hot/20 p-2 text-primary lg:hidden w-8 h-8 active:rotate-30 transition"
        onClick={() => {
          setShowed((b) => !b);
          setCollapsed(false);
        }}
      />
      {/* </button> */}
      <aside
        onClick={() => setShowed(false)}
        className={`min-h-lvh  bg-background-base transition duration-300 ease-in-out  ${
          showed
            ? "fixed h-full  flex flex-col w-full z-10"
            : `relative  mt-14 hidden lg:flex flex-col border-r gap-10 border-gray-hot ${collapsed?"w-20":"w-64"}`
        }`}
      >
        {collapsed ? (
         <PanelRightClose
        className={`hidden lg:flex fixed z-20  top-20 rounded-full bg-gray-hot/20 p-2 text-primary  w-10 h-10 active:rotate-30 transition left-16 hover:scale-150 hover:cursor-pointer`}
        style={{right:collapsed? '4rem':'1rem'}}
        onClick={() => setCollapsed((b) => !b)}
      />
        ) : (
          <PanelLeftClose
        className={`hidden lg:flex fixed z-20  top-20 rounded-full bg-gray-hot/20 p-2 text-primary  w-10 h-10 active:rotate-30 transition left-64 hover:scale-150 hover:cursor-pointer`}
        style={{right:collapsed? '4rem':'1rem'}}
        onClick={() => setCollapsed((b) => !b)}
      />
        )}
        <div className={`flex  flex-col items-center gap-1 mt-8 max-md:mx-auto  ${collapsed?"w-20":"w-64"}`}>
           
            <p
              style={{
                backgroundColor: getColorFromName(user?.name || "user"),
              }}
              className={collapsed?"w-10 h-10 rounded-full flex items-center justify-center text-white text-lg":"w-20 h-20 rounded-full flex items-center justify-center text-white text-7xl"}
            >
              {user?.name.slice(0, 1).toUpperCase()}
            </p>
          
          <p className="text-xs px-2 py-px text-text-accent bg-primary rounded">
            {user?.organisationName}
          </p>
          <p className="font-semibold text-xs">{user?.name} </p>
          <p className={collapsed?"hidden":"text-xs text-text-primary/70"}>{user?.email} </p>
        </div>
       
           <Accordion className=" w-full h-full flex flex-col"  type="single" collapsible>
          {menuItems.map((item, index) => {
          if(item.hasChilds){
              return (
              <PopUpMenuItem
              colapsed={collapsed}
              stats={statsArray}
                item={item}
                key={index}
                choosed={isShoosed(item.path)}
              />
            );
          }else if(item?.isSearch){
           if(!collapsed)  return <SearchMenuForSideBar/>
          }else {
              return (
              <MenuItem
              colapsed={collapsed}
                item={item}
                key={index}
                choosed={isShoosed(item.path)}
                count={statsArray.find(s=>item.path===s.path)?.value??null}
              />
            );
          }
          })}
          </Accordion>
        
      </aside>
    </>
  );
};

export default SideBar;
