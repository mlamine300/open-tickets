import  { useEffect, useState } from 'react';
import type { Comment, ticket } from '@/types';
import { AccordionItem,Accordion, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import CommentRow from '@/components/ticket/CommentRow';
import { getTicketCommentsAction } from '@/actions/commentAction';

const TicketViewOnModal = ({ticket}:{ticket:ticket}) => {
  const [showAllComment,setShowAllComment]=useState(false);
  const [allComment,setAllComment]=useState<Comment[]>([]);
  useEffect(()=>{
    const getAllCommentFromServer=async()=>{
     if(showAllComment&&(!allComment||allComment.length===0)){
 const comments=await getTicketCommentsAction(ticket._id||"") ;
    setAllComment(comments);
     }
     
      }
      
    
    getAllCommentFromServer();

  },[showAllComment])
  return (
    <div className='flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-2 h-fit w-full bg-background-base pb-20 px-5'>
      <h1 className=' lg:col-span-2 flex justify-center text-text-primary font-bold gap-2'><span className='italic font-semibold'>Ref/Tracking :</span> {ticket.ref} </h1>
 <div className='flex items-center gap-2 text-xs 2xl:text-sm justify-start w-full'>
    <p className='text-primary text-xs 2xl:text-sm'>Créer par :</p>
    <p className='text-xs 2xl:text-sm'>{ticket.creator?.name||"non mentionné"} </p>
 </div>
 <div className='flex items-center gap-2 text-xs 2xl:text-sm'>
    <p className='text-primary text-xs 2xl:text-sm'>Organisation émettrice :</p>
    <p className='text-xs 2xl:text-sm'>{ticket.emitterOrganization?.name||"non mentionné"} </p>
 </div>
 <div className='flex items-center gap-2 text-xs 2xl:text-sm'>
    <p className='text-primary text-xs 2xl:text-sm'>Assigné a :</p>
    <p className='text-xs 2xl:text-sm'>{ticket.assignedTo?.user?.name||"pas encore"} </p>
 </div>
 <div className='flex  items-center gap-2 text-xs 2xl:text-sm'>
    <p className='text-primary text-xs 2xl:text-sm'>Organisation Destinatrice :</p>
    <p className='text-xs 2xl:text-sm'>{ticket.recipientOrganization?.name||"non mentionné"} </p>
 </div>

  <div className='flex items-center gap-2 text-xs 2xl:text-sm'>
    <p className='text-primary text-xs 2xl:text-sm'>Status :</p>
    <p className='text-xs 2xl:text-sm'>{ticket.status||"Pending"} </p>
 </div>

  <div className='flex items-center gap-2 text-xs 2xl:text-sm'>
    <p className='text-primary text-xs 2xl:text-sm'>Priority :</p>
    <p className='text-xs 2xl:text-sm'>{ticket.priority||"basse"} </p>
 </div>

 <div className='flex flex-col justify-start items-start gap-px lg:col-span-2 '>
    <p className='text-text-primary text-xs italic font-semibold'>Message :</p>
    <p className='bg-gray-hot/20 min-h-20 w-full text-start text-md px-2 py-1 rounded italic'>
    {ticket.message||"basse"}
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas ea ullam molestiae possimus cupiditate architecto quod libero! Maiores cum omnis itaque suscipit temporibus blanditiis, consequuntur quam culpa libero. Hic, non.
    
     </p>
 </div>
 {ticket.specialFields&& <Accordion
      type="single"
      collapsible
      className="w-full col-span-2"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className='flex justify-start items-center font-bold w-fit'><span className='font-semibold italic'>Type de Reclamation :</span> {ticket.formName}</AccordionTrigger>
        <AccordionContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-balance w-full mx-10">
        {Object.entries(ticket.specialFields)?.map(val=><div className='flex items-center gap-2 text-xs 2xl:text-sm'>
    <p className='text-primary'>{`${val[0]} :`}</p>
    <p>{val[1] as string||"non mentionné"} </p>
 </div>)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>}
{(ticket.lastComment&&ticket.lastComment.createdAt)&&<div className='flex flex-col justify-start items-start gap-px lg:col-span-2 '>
    <div className='flex justify-between w-full'>

   {!showAllComment&& <p className='text-text-primary  font-semibold'>Dernier Commentaire :</p>}
    <button className='underline hover:font-semibold'  onClick={()=>setShowAllComment(b=>!b)} >{showAllComment?"cacher les commentaire":"voir tout les commentaire"} </button>
    </div>
  
   {!showAllComment&&<CommentRow className='lg:min-h-40' comment={ticket.lastComment} />}
 </div>}
{ticket.lastComment&& (<div className='col-span-2 flex flex-col items-start'>
    {showAllComment&&<div className='flex flex-col gap-2 w-full min-h-96 overflow-y-auto px-4 '>
      {allComment.map((c,index)=>
        <CommentRow className='shadow-sm lg:min-h-40' comment={c} key={index}/>
      )}
    </div>}
</div>)}
    
    
    </div>
  );
};

export default TicketViewOnModal;