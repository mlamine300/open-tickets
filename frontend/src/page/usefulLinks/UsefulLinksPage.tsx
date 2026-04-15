import { getActiveLinksAction } from "@/actions/usefulLinksAction";
import Spinner from "@/components/main/Spinner";
import { Card } from "@/components/ui/card";
import UsefulLinksCard from "@/components/usefulLinks/UsefulLinksCard";
import type { UsefulLinkType } from "@/types";
import { useEffect, useState } from "react";


const UsefulLinksPage = () => {

  const [loading, setLoading] = useState(false);
  const [usefulLinksList, setUsefulLinksList] = useState<UsefulLinkType[]>([]);
  useEffect(()=>{
    const fetchLinksList=async()=>{
      setLoading(true);
      const res=await getActiveLinksAction();
      setUsefulLinksList(res);
      setLoading(false);
    }
    fetchLinksList();

  },[])

  return (
    <main className="bg-background-base w-full h-full min-h-[90vh] p-8">
      <h3 className="text-5xl italic text-primary underline uppercase mt-2 mb-4">Lien Utiles</h3>
      <p className="bg-background p-4 rounded-xl text-lg">Cette page regroupe l’ensemble des liens essentiels et ressources utiles destinés aux employés.
Elle constitue un guide centralisé permettant d’accéder rapidement aux différentes plateformes et supports nécessaires au bon fonctionnement quotidien.</p>
     {loading?  
     ( <div className="flex w-full min-h-[40lvh] items-center justify-center ">
    <Spinner size="xl"/>
  </div>)
     :
     
     (<Card className="border-none my-4 mx-2 grid xl:grid-cols-2 2xl:grid-cols-3 grid-cols-1">

    {usefulLinksList.map(link=> <UsefulLinksCard usefulLink={link} />)}


     </Card>)}
    </main>
  )
}

export default UsefulLinksPage
