import { deleteUsefulLinkAction, fetchAllUsefulLinkssAction } from "@/actions/usefulLinksAction";
import Spinner from "@/components/main/Spinner";
import { Card } from "@/components/ui/card";
import Modal from "@/components/ui/Modal";
import UsefulLinksCard from "@/components/usefulLinks/UsefulLinksCard"
import UsefulLinksForm from "@/components/usefulLinks/UsefulLinksForm";
import type { UsefulLinkType } from "@/types";
import { useEffect, useState } from "react";


const ManageUsefulLinksPage = () => {

  const [loading, setLoading] = useState(false);
    const [usefulLinksList, setUsefulLinksList] = useState<UsefulLinkType[]>([]);
    const [refresh, setRefresh] = useState(0);

    const [selectedLink, setSelectedLink] = useState<UsefulLinkType|null>(null);
    useEffect(()=>{
      const fetchLinksList=async()=>{
        setLoading(true);
        const res=await fetchAllUsefulLinkssAction();
        setUsefulLinksList(res);
        setLoading(false);
      }
      fetchLinksList();
  
    },[refresh])

    const handleDelete=async(uf:UsefulLinkType)=>{
    
    const conf=confirm("Vous etes sur vous voulez supprimer ce link?")
    if(conf&&uf._id){
      
      await deleteUsefulLinkAction(uf._id)
     setRefresh(Math.random())
    }

  }

  const handleEdit=(ul:UsefulLinkType)=>{
    setSelectedLink(ul)
  }


  return (
  <main className="bg-background-base w-full h-full min-h-[90vh] p-8">
      <h3 className="text-5xl italic text-primary underline uppercase mt-2 mb-4">Liens Utiles</h3>
      <p className="bg-background p-4 rounded-xl text-lg">Cette page regroupe l’ensemble des liens essentiels et ressources utiles destinés aux employés.
Elle constitue un guide centralisé permettant d’accéder rapidement aux différentes plateformes et supports nécessaires au bon fonctionnement quotidien.</p>
     {loading?  
     ( <div className="flex w-full min-h-[40lvh] items-center justify-center ">
    <Spinner size="xl"/>
  </div>)
     :
     
     (<Card className="border-none my-4 mx-2 grid xl:grid-cols-2 2xl:grid-cols-3 grid-cols-1">

    {usefulLinksList.map(link=> <UsefulLinksCard usefulLink={link} editable={true} handleDelete={()=>handleDelete(link)} handleEdit={()=>handleEdit(link)} />)}


     </Card>)}
     <Modal close={()=>setSelectedLink(null)} showModal={selectedLink!==null} title="Modifier le lien" className="overflow-y-auto min-h-10/12"  >
      <UsefulLinksForm usefullLink={selectedLink} />
     </Modal>
    </main>
  )
}

export default ManageUsefulLinksPage
