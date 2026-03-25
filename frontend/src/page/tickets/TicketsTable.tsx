
import { getSpecificTicketAction } from '@/actions/ticketAction'
import { columns } from '@/components/ticket/columns'
import { DataTable } from '@/components/ticket/data-table'
import SkeletonRow from '@/components/ticket/SkeletonRow'
import TablePagination from '@/components/ticket/TablePAgination'
import type {  ticket } from '@/types'
import { socket } from '@/utils/socket'
import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

const TicketsTable = ({setTriggerRerender,setShowModal,setSelectedTicket,triggerRerender}: {setTriggerRerender:(value:number)=>void,setShowModal:any; setSelectedTicket:(ticket:ticket|null)=>void,triggerRerender:number}) => {
// useEffect(() => {
//   console.log("LOCATION:", window.location.href);
// });
 const [tickets,setTicket]=useState<ticket[]>([]);
  //const [showModal,setShowModal]=useState<string>("")

  const [searchParams]=useSearchParams();
   //const {setTriggerAppRender}=useUserContext()
 
   const [totalTicketsSize,setTotalTicketsSize]=useState(0);
   const [pending,setPending]=useState(false);
   
  const page=searchParams.get("page")||1;
    const search=searchParams.get("search")||"";
    const motif=searchParams.get("motif")||"";
    const emitterOrganizationId=searchParams.get("emitter_organization")||"";
    const recipientOrganizationId=searchParams.get("recipient_organization")||"";
    const onlyMyOrganisation=searchParams.get("notag");
    
    const priority=searchParams.get("priority")||"";
  const {pathname}=useLocation();
  
     
    useEffect(() => {
      let intervalId;
      const getMyTickets = async () => {
        setPending(true);
        setTicket([]);
        const res = await getSpecificTicketAction(pathname, { page, search,motif, emitterOrganizationId, recipientOrganizationId, priority,notag:onlyMyOrganisation });
        setTicket(res.data);
        setTotalTicketsSize(res.total);
        setPending(false);
      };

       const href=window.location.href;
      const updateDBFromSocket=()=>{
         if(href.split("/").at(-1)==="pending"||
            href.split("/").at(-1)==="open_me"||
            href.split("/").at(-1)==="open"){
          
         }
       
      }
     
      getMyTickets();
      updateDBFromSocket()
     // setTriggerAppRender(Math.random());
     
      intervalId = setInterval(() => {
        setTriggerRerender(Math.random());
      }, 5*60*1000); // 5 minute
      return () => {
        clearInterval(intervalId);
      };
    }, [pathname, page,motif,onlyMyOrganisation, priority, emitterOrganizationId, recipientOrganizationId, search, triggerRerender]);

const openConfirmation=(selectedticket:ticket,modalTitle:string)=>{
          setShowModal(modalTitle);
          setSelectedTicket(selectedticket);
          
         }
   
 const href=window.location.href;
          socket.on('notify', (msg: any) => {
            
          if(msg.action==="Ticket Créé"&&href.split("/").at(-1)==="pending"){
            setTotalTicketsSize((x)=>x+1);
          
            if(tickets.filter(x=>x._id===msg.payload).length===0){
              setTicket([msg.payload,...tickets])
            }
            // setTicket((arr)=>{
            //   if(arr.filter(x=>x._id===msg.payload._id).length===0)return[msg.payload,...arr]
            //   return arr;
            // }
               
            // );
            
          }
          if(msg.action==="Ticket Relancé"&&(href.split("/").at(-1)==="open"||href.split("/").at(-1)==="open_me")){
          
            setTriggerRerender(Math.random());

          }
    });

  return (
    <>
    {pending?  <div className="overflow-hidden rounded-md border flex items-center justify-center w-full border-gray-hot">
          <table className="bg-background-base border border-gray-hot w-full">
            <thead>
              <tr>
                {columns({ actions: {}, path: pathname }).map((col, idx) => (
                  <th key={idx} className="text-xs lg:text-sm px-4 py-2 bg-gray-hot/50 text-primary border border-gray-hot">
                    {/* Try to render header if possible */}
                    {typeof col.header === 'string' ? col.header : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonRow key={idx} columns={columns({ actions: {}, path: pathname }).length} />
              ))}
            </tbody>
          </table>
        </div>:<DataTable showTicket={(ticket:ticket)=>openConfirmation(ticket,"ticket")}  columns={columns({actions:{
          addComment:(ticket:ticket)=>setSelectedTicket(ticket),
          // handleTakeInCharge:(ticket:ticket)=>openConfirmation(ticket,"confirmation"),
          // addComment:(ticket:ticket)=>setSelectedTicket(ticket),
         showTicket:(ticket:ticket)=>openConfirmation(ticket,"ticket"),
        //  handleClosing:(ticket:ticket)=>openConfirmation(ticket,"close"),
        //  handleFormward:(ticket:ticket)=>openConfirmation(ticket,"forward"),
        },
         path:pathname
         
         })} data={tickets} />}
       
         <TablePagination maxPages={Math.ceil(totalTicketsSize/10)} className='mt-auto ml-auto gap-2 p-5'/>
    </>
  )
}

export default TicketsTable
