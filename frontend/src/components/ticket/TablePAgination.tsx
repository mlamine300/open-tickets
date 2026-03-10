import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router";
import Button from "../ui/Button";



const TablePagination = ({className,maxPages}:{className?:string;maxPages?:number}) => {
    
  const [searchParams, setSearchParams] = useSearchParams();
    const page=Number(searchParams.get("page")||"1");

    const handlePrevPageButton=()=>{
   searchParams.set("page",(page-1)+"")
    setSearchParams(searchParams);
    }
     const handleNextPageButton=()=>{
     searchParams.set("page",(page+1)+"")
    setSearchParams(searchParams);
    }
  return (
    <div className={cn(className,"flex flex-row")}>
      <Button className="px-4 py-1 text-sm bg-background-base border border-gray-hot/50 font-semibold text-primary shadow-black shadow-2xl" disabled={page===1} text="Previous" variant="shadow"
       onClick={()=>handlePrevPageButton()}  />
        <Button className="px-4 py-1 text-sm bg-background-base border border-gray-hot/50 font-semibold text-primary shadow-black shadow-2xl" disabled={maxPages?page===maxPages:false} text="Next" variant="primary"
         onClick={()=>handleNextPageButton()}  />
    </div>
  );
};

export default TablePagination;