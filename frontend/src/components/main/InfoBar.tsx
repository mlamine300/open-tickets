import { getLastInfo } from "@/actions/infoAction";
import { cn } from "@/lib/utils";
import type { Info } from "@/types";
import { useEffect, useState } from "react";


const InfoBar = ({className}:{className?:string}) => {
    
    const [info, setInfo] = useState<Info>({message:"",isLatin:true});
    const [triggerRerender, setTriggerRerender] = useState<number>(0);
    const timeTorefresh=import.meta.env.DEV? 5*1000: 5*60*1000;
    
   useEffect(() => {
           let intervalId;
           
           const fetchLastInfo = async () => {
            const fetchedInfo=await getLastInfo();
            
            if(fetchedInfo)
            {
          
              setInfo(fetchedInfo)
             
            }
           };
          
           fetchLastInfo();
          
           intervalId = setInterval(() => {
             setTriggerRerender(Math.random());
           }, timeTorefresh); // 5 minute
           return () => {
             clearInterval(intervalId);
           };
         }, [triggerRerender]);
         if(!info||!info.message||info.message==="")return;
  return (
    <div className={cn("fixed top-11/12 w-full h-16 bg-gray-hot/90 flex items-center cursor-pointer group",className)} >
     <div className={cn("w-full min-w-fit group-hover:[animation-play-state:paused]",info.isLatin?" animate-[inverseslide_40s_linear_infinite] ":"animate-[slide_40s_linear_infinite] ") }>
    <p className="text-lg text-text-primary text-nowrap ">
      {info.message}
</p>
    </div>
    </div>
  )
}

export default InfoBar
