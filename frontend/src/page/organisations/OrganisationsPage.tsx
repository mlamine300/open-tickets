
import { deleteOrganisationAction, fetchOrganisationsAction } from "@/actions/organisationAction";
import { columns } from "@/components/organisation/columns";
import { DataTable } from "@/components/organisation/data-table";
import FilterTableDiv from "@/components/organisation/FilterTableDiv";
import TablePagination from "@/components/ticket/TablePAgination";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import Modal from "@/components/ui/Modal";
import type { Organisation } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";


const OrganisationsPage = () => {
   
    const [pending, setPending] = useState(false);
    const [organisations, setOrganisations] = useState<Organisation[] >([]);
    
    const x=useSearchParams();
    const searchParams=x[0];
    const page=Number(searchParams.get("page"))||1;
    const search=searchParams.get("search")||"";
    const wilaya=searchParams.get("wilaya")||"";
    const active=searchParams.get("active")||"";
    const [toDeleteId, setToDeleteId] = useState<string|null>(null);
        const [showModal, setShowModal] = useState(false);
        const [triggerRerender, setTriggerRerender] = useState<number>(0);
    useEffect(()=>{
       
        
            const fetchOrganisation=async()=>{
                setPending(true);
                const organisationsRes=await fetchOrganisationsAction({page,search,wilaya,active:active+""});
                if(organisationsRes)setOrganisations(organisationsRes);
                setPending(false);
            }
        
        fetchOrganisation();
       
    },[page,search,wilaya,triggerRerender,active])
    return (
        <div className="flex w-full h-full">
            <Card className='flex item-center bg-background-base border-none shadow-2xl w-full p-5 min-h-screen justify-start'>
                <FilterTableDiv/>
                <DataTable pending={pending} columns={columns({setToDeleteId,setShowModal})} data={organisations} />
                 <TablePagination maxPages={Math.ceil(10)} className='mt-auto ml-auto gap-2 p-5'/>
            </Card>
            {toDeleteId&&
            <Modal 
            className="flex flex-col justify-between py-10"
            close={()=>{
                setToDeleteId(null);
                setShowModal(false);
            
            }} showModal={showModal} title={`vous étes sur vous voulez supprimer l'astation : ${toDeleteId}`} >
              <>
                <p>La supprission d'une organisation est irreverssible, </p>
              <div className="flex justify-between">
                <Button text="Cancel" variant="primary" className="bg-gray-cold hover:bg-gray-hot"/>
                 <Button onClick={async()=>{
                    await deleteOrganisationAction(toDeleteId)
                    setShowModal(false);  
                    setToDeleteId(null); 
                    setTriggerRerender(Math.random())
                     
                }}
                     text="Supprimer" variant="primary" className="bg-red-500 hover:bg-red-900"/>
              </div>
                    </>
                </Modal>}
        </div>
    )
}

export default OrganisationsPage
