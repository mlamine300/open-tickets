import type { UsefulLinkType } from "@/types"
import { cn } from "@/lib/utils";
import { getColorFromName } from "@/utils/helper";
import { Link } from "react-router";


const UsefulLinksCard = ({usefulLink,cardClassName,textClassName,imageClassName}:{usefulLink:UsefulLinkType;cardClassName?:string;textClassName?:string;imageClassName?:string}) => {
  return (
    <Link   target="_blank" to={usefulLink.link} className={cn(cardClassName,"border-b-2 border-primary flex items-center gap-2 p-2 shadow-2xl min-h-50 max-h-50")} >
      {usefulLink.imageLink?
      ( <img src={usefulLink.imageLink||""} className={cn(imageClassName,"rounded-full bg-cover w-30 h-30 ")} /> )
       :
      (<p
                    style={{
                      backgroundColor: getColorFromName(usefulLink?.name || "user"),
                    }}
                    className={cn(imageClassName,"w-30 h-30 rounded-full flex items-center justify-center text-white text-7xl")}
                  >
                    {usefulLink?.name.slice(0, 1).toUpperCase()}
                  </p>)
      }
      <div className="text-start">
<h3 className={cn(textClassName,"text-lg font-semibold h-full py-2 ")}>
        {usefulLink.name}
      </h3>
      <p className="text-text-primary/70 italic text-sm max-h-28  overflow-auto ">{usefulLink.description  } </p>
      </div>
      
    </Link>
  )
}

export default UsefulLinksCard
