import FormNameRadarChart from "@/components/dashboard/FormNameRadarChart";
import OrganisationClassement from "@/components/dashboard/OrganisationClassement";
import PriorityStatusChart from "@/components/dashboard/PriorityStatusChart";
import Spinner from "@/components/main/Spinner";
import Input from "@/components/ui/Input";
import { API_PATH } from "@/data/apiPaths";
import { exportNotCompletReport } from "@/lib/utils";

import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { FaFileExcel } from "react-icons/fa6";


const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [reportDateStart, setReportDateStart] = useState<string>("");
  const [reportDateEnd, setreportDateEnd] = useState<string>("");
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

  const donwloadNotCompleteReport=async()=>{
    try {
      const notCompleteTicketsResponse=await axiosInstance.get(API_PATH.REPORTS.NOT_COMPLETE);
      if(notCompleteTicketsResponse.status===200){
        const notCompleteTickets=notCompleteTicketsResponse.data.data;
        exportNotCompletReport(notCompleteTickets);
      }
    } catch (error) {
      console.log(error)
    }
  }
  const donwloadDateReport=()=>{
    alert(reportDateStart+"\t"+reportDateStart)
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
          <div className="flex flex-col items-start min-w-full max-h-32 lg:col-span-2 py-4 bg-white rounded-3xl px-4">
            <p className="text-2xl font-semibold underline">Rapports</p>
        <div className="flex justify-between w-full  items-center pl-10 ">

        <div className="flex gap-4 w-8/12   items-center ">
          <Input inputClassName="text-xs" parentClassName="gap-0" labelClassName="text-xs italic" label="date de création (debut)" placeHolder="" type="date" value={reportDateStart} onChange={(e)=>setReportDateStart(e.target.value)} />
         <Input inputClassName="text-xs" parentClassName="gap-0" labelClassName="text-xs italic"  label="date de création (fin)" placeHolder="" type="date" value={reportDateEnd} onChange={(e)=>setreportDateEnd(e.target.value)} />
         <button disabled={!reportDateStart||!reportDateEnd} onClick={()=>{
           donwloadDateReport()
          }}   className="flex gap-4 items-center h-fit  px-4 py-1 border text-primary border-gray-hot rounded-lg hover:font-semibold hover:border-primary bg-white shadow-2xl disabled:text-gray-cold">
            Telecharger
            <FaFileExcel />
          </button>
          </div>
          <button onClick={()=>{
            donwloadNotCompleteReport()
          }}   className="flex gap-4 items-center max-h-20 h-fit  px-4 py-1 border text-primary border-gray-hot rounded-lg hover:font-semibold hover:border-primary bg-white shadow-2xl">
            ticket en soufrrance
            <FaFileExcel />
          </button>
            </div>
          
         
        </div>
        <OrganisationClassement title="Classement Organisation emmitrice" data={emmiterData} fill="#3fa9fc" fillActive="#aa39ff" strokeActive="#5500ee"/>
       
        <OrganisationClassement title="Classement Organisation réceptionniste" data={receiptionData} fill="#3fa9fc" fillActive="#aa39ff" strokeActive="#5500ee"/>
        <PriorityStatusChart isAnimationActive={true} statusData={statusData} priorityData={priorityData} />
        <FormNameRadarChart data={formData} />
      </div>
    
  );
};

export default Dashboard;