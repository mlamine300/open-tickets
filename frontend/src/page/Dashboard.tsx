import FormNameRadarChart from "@/components/dashboard/FormNameRadarChart";
import OrganisationClassement from "@/components/dashboard/OrganisationClassement";
import PriorityStatusChart from "@/components/dashboard/PriorityStatusChart";
import Spinner from "@/components/main/Spinner";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";


const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  useEffect(()=>{
    const x=async()=>{
      const res=await axiosInstance.get(`/api/stat/status`)
      if(res.status===200)
        setStats(res.data.data);
    }
    x();
  },[])
  const getFill=(name:string)=>{
    const fills:any={
      open:"#125099",
      pending:"#ee1253",
      complete:"#00aa60",
      medium:"#ff880060",
      high:"#a0020260",
      low:"#e7878f60"
    }

    return fills[name]||"#ffee33"
  }
  if(!stats)return <div>
    <Spinner/>
  </div>
  const statusData=stats.byStatus.map((bs:any)=> {return {name:bs._id,value:bs.count,fill:getFill(bs._id)}});
  const priorityData=stats.byPriority.map((bp:any)=>{
    return {name:bp._id,value:bp.count,fill:getFill(bp._id)}
  })
  const totaleCount=stats.total?.at(0)?.totalTickets;
  const formData=stats.formName.map((fn:any)=>{
    return {form:fn._id,value:fn.count,fullMark:totaleCount}
  })
  const emmiterData=stats.emmiter.map((ed:any)=>{
    return {name:ed.name,count:ed.count}
  })
  const receiptionData=stats.recipient.map((ed:any)=>{
    return {name:ed.name,count:ed.count}
  })
  console.log(emmiterData)
  return (
   
      <div className="grid grid-cols-1 w-full gap-1 justify h-full lg:grid-cols-2 min-h-screen xl:min-w-[70svw] ">
        <OrganisationClassement title="Classement Organisation emmitrice" data={emmiterData} fill="#3fa9fc" fillActive="#aa39ff" strokeActive="#5500ee"/>
       
        <OrganisationClassement title="Classement Organisation réceptionniste" data={receiptionData} fill="#3fa9fc" fillActive="#aa39ff" strokeActive="#5500ee"/>
        <PriorityStatusChart isAnimationActive={true} statusData={statusData} priorityData={priorityData} />
        <FormNameRadarChart data={formData} />
      </div>
    
  );
};

export default Dashboard;