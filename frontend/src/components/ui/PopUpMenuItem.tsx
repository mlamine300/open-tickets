

import {
 
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import MenuItem from './MenuItem';
import type { MenuItemType, SimpleMenuItemType } from "@/types";
import { useLocation } from "react-router";

const PopUpMenuItem = ({
  item,
  choosed,
  colapsed,
  stats
}: {
  item: MenuItemType;
colapsed: boolean;
  choosed: boolean;
  stats?:{path:string;value:number}[];
}) => {
     const { pathname } = useLocation();
  const isChoosed = (link: string) => {
  //  if (link === "/") 
        return link === pathname;
   // return pathname.includes(link);
  };
     const Icon = item.icon;
     const TotalCount=(stats&&Array.isArray(stats)&&stats.length>0)?stats.find(s=>s.path===item.path)?.value||null:null;
  return (
  
  <AccordionItem className="border-gray-hot/50" value={item.id}>
    <AccordionTrigger className={`flex p-2 items-center  text-lg my-1 cursor-pointer border-none ${
        choosed
          ? "text-primary bg-primary/10 border-r-2 border-primary "
          : "text-text-primary/90"
      } `}>
       <div className="flex  gap-4 w-full">

      <Icon className={colapsed?"w-8 h-8":"w-5 h-5"} />
      <div className={colapsed?"hidden":"flex justify-between w-full "}>
        <p className={colapsed?"hidden":"text-sm font-normal"}>{item.label} </p>
         {TotalCount&& <p className="text-primary text-sm font-bold italic">{TotalCount}</p>}
       
      </div>
       </div>
    
    </AccordionTrigger>
    <AccordionContent className="ml-4">
      <div className='flex flex-col gap-2'>
      {item.childs?.map((c:SimpleMenuItemType)=>
      {
        const count=(stats&&Array.isArray(stats)&&stats.length>0)?stats.find(s=>s.path===c.path)?.value||null:null;
        return <MenuItem count={count} colapsed={colapsed} item={c} choosed={isChoosed(c.path)} />
      })
      }
      </div>
    </AccordionContent>
  </AccordionItem>

  );
};

export default PopUpMenuItem;