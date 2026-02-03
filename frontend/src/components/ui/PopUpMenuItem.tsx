

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
  colapsed
}: {
  item: MenuItemType;
colapsed: boolean;
  choosed: boolean;
}) => {
     const { pathname } = useLocation();
  const isChoosed = (link: string) => {
  //  if (link === "/") 
        return link === pathname;
   // return pathname.includes(link);
  };
     const Icon = item.icon;
     
  return (
  
  <AccordionItem className="border-gray-hot/50" value={item.id}>
    <AccordionTrigger className={`flex p-2 items-center  text-lg my-1 cursor-pointer border-none ${
        choosed
          ? "text-primary bg-primary/10 border-r-2 border-primary "
          : "text-text-primary/90"
      }`}>
       <div className="flex  gap-4">

      <Icon className={colapsed?"w-8 h-8":"w-5 h-5"} />
      <p className={colapsed?"hidden":"text-sm font-normal"}>{item.label} </p>
       </div>
    
    </AccordionTrigger>
    <AccordionContent className="ml-4">
      <div className='flex flex-col gap-2'>
      {item.childs?.map((c:SimpleMenuItemType)=><MenuItem colapsed={colapsed} item={c} choosed={isChoosed(c.path)} />)}
      </div>
    </AccordionContent>
  </AccordionItem>

  );
};

export default PopUpMenuItem;