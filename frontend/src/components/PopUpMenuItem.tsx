

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import MenuItem from './MenuItem';
import type { MenuItemType, SimpleMenuItemType } from "../../../types";
import { useLocation } from "react-router";

const PopUpMenuItem = ({
  item,
  choosed,
}: {
  item: MenuItemType;

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
  
  <AccordionItem value={item.id}>
    <AccordionTrigger className={`flex flex-row p-2 items-center gap-4 text-lg my-1 cursor-pointer border-none ${
        choosed
          ? "text-primary bg-primary/10 border-r-2 border-primary "
          : "text-text-primary/90"
      }`}>
       
      <Icon className={""} />
      <p className="text-sm">{item.label} </p>
    
    </AccordionTrigger>
    <AccordionContent className="ml-4">
      <div className='flex flex-col gap-2'>
      {item.childs?.map((c:SimpleMenuItemType)=><MenuItem item={c} choosed={isChoosed(c.path)} />)}
      </div>
    </AccordionContent>
  </AccordionItem>

  );
};

export default PopUpMenuItem;