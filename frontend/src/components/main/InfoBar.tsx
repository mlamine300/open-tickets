import { getLastInfo } from "@/actions/infoAction";
import { cn } from "@/lib/utils";
import type { Info } from "@/types";
import { useEffect, useState } from "react";


const InfoBar = () => {
    
    const [info, setInfo] = useState<Info>({message:"",isLatin:true});
    const [triggerRerender, setTriggerRerender] = useState<number>(0);
    const timeTorefresh=import.meta.env.DEV? 5*1000: 5*1000;
    
   useEffect(() => {
           let intervalId;
           
           const getStats = async () => {
            const fetchedInfo=await getLastInfo();
            
            if(fetchedInfo)
            {
          
              setInfo(fetchedInfo)
             
            }
           };
          
           getStats();
          
           intervalId = setInterval(() => {
             setTriggerRerender(Math.random());
           }, timeTorefresh); // 5 minute
           return () => {
             clearInterval(intervalId);
           };
         }, [triggerRerender]);
         if(!info||!info.message||info.message==="")return;
  return (
    <div className="fixed top-11/12 lg:top-10/12 w-full h-16 bg-gray-hot/20 flex items-center cursor-pointer">
     <div className={cn("w-full hover:[animation-play-state:paused]",info.isLatin?" animate-[inverseslide_20s_linear_infinite] ":"animate-[slide_20s_linear_infinite] ") }>
    <p className="text-lg text-text-primary line-clamp-1 ">
      {info.message}
</p>
    </div>
    </div>
  )
}

export default InfoBar
