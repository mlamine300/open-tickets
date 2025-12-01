import React, { useEffect, useState } from 'react';
import type { Comment, ticket } from '../../../types';
import { AccordionItem,Accordion, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import CommentRow from '@/components/CommentRow';
import Button from './ui/Button';
import { getTicketCommentsAction } from '@/actions/action';

const TicketViewOnModal = ({ticket}:{ticket:ticket}) => {
  const [showAllComment,setShowAllComment]=useState(false);
  const [allComment,setAllComment]=useState<Comment[]>([]);
  useEffect(()=>{
    const getAllCommentFromServer=async()=>{
     if(showAllComment&&(!allComment||allComment.length===0)){
 const comments=await getTicketCommentsAction(ticket._id) ;
    setAllComment(comments);
     }
     
      }
      
    
    getAllCommentFromServer();

  },[showAllComment])
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 h-fit bg-background-base pb-20 px-5'>
      <h1 className='lg:col-span-2 flex justify-center text-text-primary font-bold gap-2'><span className='italic font-semibold'>Ref/Tracking :</span> {ticket.ref} </h1>
 <div className='flex items-center gap-2 text-xs lg:text-sm justify-start'>
    <p className='text-text-primary/50'>Créer par :</p>
    <p>{ticket.creator?.name||"non mentionné"} </p>
 </div>
 <div className='flex items-center gap-2 text-xs lg:text-sm'>
    <p className='text-text-primary/50'>Organisation émettrice :</p>
    <p>{ticket.emitterOrganization?.name||"non mentionné"} </p>
 </div>
 <div className='flex items-center gap-2 text-xs lg:text-sm'>
    <p className='text-text-primary/50'>Assigné a :</p>
    <p>{ticket.assignedTo?.user.name||"pas encore"} </p>
 </div>
 <div className='flex items-center gap-2 text-xs lg:text-sm'>
    <p className='text-text-primary/50'>Organisation Destinatrice :</p>
    <p>{ticket.recipientOrganization?.name||"non mentionné"} </p>
 </div>

  <div className='flex items-center gap-2 text-xs lg:text-sm'>
    <p className='text-text-primary/50'>Status :</p>
    <p>{ticket.status||"Pending"} </p>
 </div>

  <div className='flex items-center gap-2 text-xs lg:text-sm'>
    <p className='text-text-primary/50'>Priority :</p>
    <p>{ticket.priority||"basse"} </p>
 </div>

 <div className='flex flex-col justify-start items-start gap-px lg:col-span-2 '>
    <p className='text-text-primary text-xs italic font-semibold'>Message :</p>
    <p className='bg-gray-hot/20 min-h-20 w-full text-start text-md px-2 py-1 rounded'>
    {ticket.message||"basse"}
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas ea ullam molestiae possimus cupiditate architecto quod libero! Maiores cum omnis itaque suscipit temporibus blanditiis, consequuntur quam culpa libero. Hic, non.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint cupiditate, tenetur praesentium soluta ducimus quam ipsam debitis. Id non totam ipsam velit quibusdam. Ad eius, quaerat praesentium autem id saepe.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab recusandae error repudiandae. Ea, ab necessitatibus! Voluptatum, eligendi repellat commodi id, quam doloremque delectus voluptas harum animi, pariatur nulla consectetur possimus.

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
        {Object.entries(ticket.specialFields)?.map(val=><div className='flex items-center gap-2 text-xs lg:text-sm'>
    <p className='text-text-primary/50'>{`${val[0]} :`}</p>
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
  
   {!showAllComment&&<CommentRow comment={ticket.lastComment} />}
 </div>}
{ticket.lastComment&& (<div className='col-span-2 flex flex-col items-start'>
    {showAllComment&&<div className='flex flex-col gap-2 w-full min-h-96 overflow-y-auto '>
      {allComment.map((c,index)=>
        <CommentRow className='shadow-none' comment={c} key={index}/>
      )}
    </div>}
</div>)}
    
    
    </div>
  );
};

export default TicketViewOnModal;