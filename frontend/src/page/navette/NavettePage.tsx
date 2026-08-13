import { getAllorganisationsAction } from "@/actions/organisationAction";
import NavetteHeader from "@/components/navette/NavetteHeader"
import { Card } from "@/components/ui/card"
import type { Organisation } from "@/types";
import { useEffect, useState } from "react"


const NavettePage = () => {
  const [oraganisations, setOraganisations] = useState<Organisation[]>([]);
  useEffect(()=>{
    const fetchOrganisations=async()=>{
      const data=await getAllorganisationsAction();
      if(data)setOraganisations(data);
    }
    fetchOrganisations();
  },[])
  return (
      <div className="flex w-full h-full">
            <Card className='flex item-center bg-background-base border-none shadow-2xl w-full p-5 min-h-screen justify-start'>
              <NavetteHeader organisations={oraganisations} />
              </Card>
      
    </div>
  )
}

export default NavettePage
