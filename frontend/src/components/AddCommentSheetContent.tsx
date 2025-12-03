import React, { useRef, useState } from 'react';
import { SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import type { ticket } from '../../../types';
import { Select, SelectContent, SelectItem, SelectValue,SelectTrigger } from './ui/select';
import { COMMENT_ACTIONS, COMMENT_ACTIONS_DICTIONNAIRE } from '@/utils/data';
import Input from './ui/Input';
import Button from './ui/Button';
import { AddCommentAction, closeTicketAction, relanceeTicketAction, TakeTicketIncharge } from '@/actions/action';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/user/userContext';
import { Link } from 'react-router';

const AddCommentSheetContent = ({ticket,refresh}:{ticket:ticket,refresh:()=>void}) => {
    const [action,setAction]=useState<string>("comment");
    const[pending,setPending]=useState(false);
    const [message,setMessage]=useState<string>("");
    const ref=useRef<HTMLButtonElement|null>(null);
    const {user}=useUserContext();
    
    const handleAction=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
      e.preventDefault();
     setPending(true);
      switch(action){
        case "in_charge":{
          handleTakeInCharge();
          break;
        }
        
         case "relancer":{
          handleRelance();
         
          break;
        }
         case "close":{
          handleClosing();
          break;
        }
        default:{
          handleComment();
        }
         refresh();
      }
      setPending(false);
    }

    const handleComment=async()=>{
     
      if(!message||!action){
        toast.error("tu devrais ecrir un message et choisir une action")
      }
      if(ticket._id){
  await AddCommentAction(ticket._id,action,message);
      setAction("comment");
      setMessage("");
      if(ref&&ref.current){
      ref.current.click();
      }
   
      }
     
    }
      const handleTakeInCharge=async()=>{
        setPending(true);
        if(ticket.status!=="pending"){
          toast.error(`les status de ticket: (${ticket.status}), vous pouvez pas le prendre en charge`)
          return
        }
        if(ticket._id){
          await  TakeTicketIncharge(ticket._id,message);
         setAction("comment");
      setMessage("");
      if(ref&&ref.current){
      ref.current.click();
      }
      setPending(false)
         refresh();
        }
        }
        const handleClosing=async()=>{
          setPending(true)
           if(ticket.assignedTo?.user._id!==user?._id){
            console.log();
            
          toast.error("vous pouvez pas procéder a cette action (ticket est prise en charge par a une autre compte)")
        return;
        }
        if(ticket._id){
           await closeTicketAction(ticket._id,message);
          setAction("comment");
      setMessage("");
      if(ref&&ref.current){
      ref.current.click();
      }
      setPending(false);
      refresh();
        }
        }
        const handleRelance=async()=>{
          setPending(true)
           if(ticket.assignedTo?.user._id!==user?._id){
          toast.error("vous pouvez pas procéder a cette action (ticket est prise en charge par a une autre compte)")
        return;
        }
       
      if(ticket._id){
         await relanceeTicketAction(ticket._id,message);
        setAction("comment");
      setMessage("");
      if(ref&&ref.current){
      ref.current.click();
      }
      setPending(false)
      refresh();
      }
        }
  return (
      <SheetContent className='h-full bg-background-base'>
    <SheetHeader>
      <SheetTitle>Ajouter un commentaire</SheetTitle>
    </SheetHeader>
     <form action="" className='my-4 w-full h-full px-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-1'>

      <div  className='flex items-center gap-2 '>
        <p className='italic font-semibold text-sm'>Ticket Id:</p>
        <Link to={`/ticket/${ticket._id}`} className='text-sm underline hover:font-semibold'>{ticket._id}</Link>
      </div>
      <div className='flex items-center gap-2 '>
        <p className='italic font-semibold text-sm'>Ref/Tracking:</p>
        <p className='text-sm'>{ticket.ref}</p>
      </div>
      </div>
            <div className={"flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-sm italic '} htmlFor={`select-action`}>Action :</label>
             
                 <Select 
                value={action}
                onValueChange={(value) => 
                  
                  setAction(value)

                }
              >
                
                <SelectTrigger id='select-action' className={"w-10/12 mx-2"}>
                  <SelectValue  placeholder={`Action`} />
                  
                </SelectTrigger>
                
                
                <SelectContent  id={`select-action`}  className='bg-background-base'>
                  
                 

                 <p className='text-sm hover:cursor-pointer'  onClick={(e)=>setAction("")}>
                    Actions
                  </p>
                  { Object.entries(COMMENT_ACTIONS_DICTIONNAIRE).map((val) => (
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val[0]} value={val[0]||"---"}>
                      {val[1]}
                    </SelectItem>
                  ))}
                  
                </SelectContent>
                
              </Select>
                </div>
                <Input parentClassName='w-full' inputClassName='h-42' type='area' placeHolder='Ajouter votre commentaire ici...' label='Commentaire' onChange={(e)=>setMessage(e.target.value)} value={message} />
            
                  <Button disabled={pending} className='disabled:bg-gray-cold/50' type='button' text='Ajouter' variant='primary' onClick={(e)=>{
                    handleAction(e)
                  }} />
                  <SheetClose ref={ref}>
                    <p    className='border-red-500 text-red-500 hover:text-red-300 hover:border-red-400 w-full mt-auto border' >Ferme</p>
                  </SheetClose>
      </form>
  </SheetContent>
  );
};

export default AddCommentSheetContent;