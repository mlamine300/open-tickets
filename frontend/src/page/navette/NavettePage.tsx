import { searchNavetteAction } from "@/actions/navetteAction";
import { getAllorganisationsAction } from "@/actions/organisationAction";
import AddNavette from "@/components/navette/AddNavette";
import { columns } from "@/components/navette/columns";
import { DataTable } from "@/components/navette/data-table";
import NavetteHeader from "@/components/navette/NavetteHeader"
import TablePagination from "@/components/ticket/TablePAgination";
import { Card } from "@/components/ui/card"
import Modal from "@/components/ui/Modal";
import type { Navette, Organisation } from "@/types";
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router";


const NavettePage = () => {
  const [oraganisations, setOraganisations] = useState<Organisation[]>([]);
  const [selectedNavette, setselectedNavette] = useState<Navette|null>(null);
  const [searchParams]=useSearchParams();
  const [pending, setPending] = useState(false);
const [navettes, setNavettes] = useState<Navette[]>([]);
const organisation=searchParams.get("organisation")
const timeStart=searchParams.get("start_date")||"";
//const timeStart=(start_date&&start_date.length>2)?formatDate(new Date(start_date),"dd-MM-yyyy"):""
const timeEnd=searchParams.get("end_date")||""
//const timeEnd=(end_date&&end_date.length>2)?formatDate(new Date(end_date),"dd-MM-yyyy"):""
const page=searchParams.get("page")

useEffect(()=>{
  const fetchNavette=async()=>{
    setPending(true)
    const fetchedNavettes=await searchNavetteAction({organisation,timeStart,timeEnd,page});
    setNavettes(fetchedNavettes);
    setPending(false)

  }
  fetchNavette();
},[organisation,timeStart,timeEnd,page])



  useEffect(()=>{
    const fetchOrganisations=async()=>{
      setPending(true);
      const data=await getAllorganisationsAction();
      setPending(false);
      if(data)setOraganisations(data);
    }
    fetchOrganisations();
  },[])
  return (
      <div className="flex w-full h-full">
            <Card className='flex item-center bg-background-base border-none shadow-2xl w-full p-5 min-h-screen justify-start'>
              <NavetteHeader  organisations={oraganisations} />
               <DataTable pending={pending} columns={columns(setselectedNavette)} data={navettes} /> 
                  <TablePagination maxPages={Math.ceil(10)} className='mt-auto ml-auto gap-2 p-5'/>
                   <Modal 
            className="flex flex-col justify-between py-10 overflow-y-auto max-h-9/12 h-fit min-h-6/12"
            close={()=>setselectedNavette(null)} showModal={selectedNavette!==null} title="Modifier la navette de jour" >
             <AddNavette navette={selectedNavette} closeModal={()=>setselectedNavette(null)}/>
                </Modal>
              </Card>
      
    </div>
  )
}

export default NavettePage
