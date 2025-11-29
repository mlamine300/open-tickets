import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router";
import Button from "./ui/Button";



const TablePagination = ({className,next,previous,maxPages}:{className?:string;next?:any;previous?:any;maxPages?:number}) => {
    
  const [searchParams, setSearchParams] = useSearchParams();
    const page=Number(searchParams.get("page")||"1");

  return (
    <div className={cn(className,"flex flex-row")}>
      <Button className="px-4 py-1 text-sm bg-background-base border border-gray-hot/50 font-semibold text-primary shadow-black shadow-2xl" disabled={page===1} text="Previous" variant="shadow" onClick={()=>{
         setSearchParams((p)=>{return{...p,page:(page-1)+""}});
            if(previous)previous();
      }}  />
        <Button className="px-4 py-1 text-sm bg-background-base border border-gray-hot/50 font-semibold text-primary shadow-black shadow-2xl" disabled={maxPages?page===maxPages:false} text="Next" variant="primary" onClick={()=>{
           setSearchParams((p)=>{return{...p,page:(page+1)+""}});
            if(next)next();
        }}  />
    </div>
  );
};

export default TablePagination;