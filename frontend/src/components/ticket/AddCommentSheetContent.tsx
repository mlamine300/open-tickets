import React, { useRef, useState } from 'react';
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import type { Organisation, ticket, User } from '@/types';
import { Select, SelectContent, SelectItem, SelectValue,SelectTrigger } from '../ui/select';
//import {  COMMENT_ACTIONS_DICTIONNAIRE } from '@/data/data';
import Input from '../ui/Input';
import Button from '../ui/Button';
import {  closeTicketAction, relanceeTicketAction, subscribeOrganisationAction, TakeTicketInchargeAction } from '@/actions/ticketAction';
import {AddCommentAction} from "@/actions/commentAction"
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/user/userContext';
import { Link } from 'react-router';
import SelectWithSearch from '../ui/SelectWithSearch';
import {  checkPermissionToDoAction, checkPermissionToTakeInCharge } from '@/utils/functions';
import { useForm } from 'react-hook-form';

const AddCommentSheetContent = ({ticket,refresh,organisations}:{ticket:ticket,refresh:()=>void,organisations:Organisation[]}) => {
    const [action,setAction]=useState<string>("comment");
    const [organisation, setorganisation] = useState<string>("");
    const[pending,setPending]=useState(false);
    const [message,setMessage]=useState<string>("");
    const ref=useRef<HTMLButtonElement|null>(null);
    const {user}=useUserContext();
    const actions=getPermissableActions(user,ticket);
    const myform=useForm();
    const handleAction=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
      try {
        e.preventDefault();
    
      setPending(true);
     
      switch(action){
        case "in_charge":{
           if((!user||!checkPermissionToTakeInCharge(user,ticket))){

      toast.error("Il est impossible d'effectuer cette opération car l'organisation prévue diffère de votre organisation.")
    return; 
    }
          handleTakeInCharge();
          break;
        }
        
         case "relancer":{
                if((!user||!checkPermissionToDoAction(user,ticket))){

      toast.error("Il est impossible d'effectuer cette opération car l'organisation prévue diffère de votre organisation.")
    return; 
    }
          handleRelance();
         
          break;
        }
         case "close":{
          
            //     if((!user||!checkPermissionToDoAction(user,ticket))){

            // toast.error("Il est impossible d'effectuer cette opération car l'organisation prévue diffère de votre organisation.")
            //        return; 
            //     }
          handleClosing();
          break;
        }
        case "subscribe":{

            if((!user||!checkPermissionToDoAction(user,ticket))){

      toast.error("Il est impossible d'effectuer cette opération car l'organisation prévue diffère de votre organisation.")
    return; 
                }
          handleSubscribe();
          break;
        }
        default:{
          handleComment();
        }
         refresh();
      } 
      } catch (error) {
        console.log(error)

      }
     
      myform.reset({});
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
          await  TakeTicketInchargeAction(ticket._id,`${user?.name}\n ${message} `);
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
          
           if(!user||!checkPermissionToDoAction(user,ticket)){  
          toast.error("vous pouvez pas procéder a cette action (ticket est prise en charge par a une autre compte)")
        return;
        }
        setPending(true)
        if(ticket._id){
           await closeTicketAction(ticket._id,`ticket cloturer par ${user?.name} \n${message}`);
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
            if(!user||!checkPermissionToDoAction(user,ticket)){  
          toast.error("vous pouvez pas procéder a cette action (ticket est prise en charge par a une autre compte)")
        return;
        }
        setPending(true)
           
       
      if(ticket._id){
         await relanceeTicketAction(ticket._id,`ticket relancé par ${user?.name} \n${message}`);
        setAction("comment");
      setMessage("");
      if(ref&&ref.current){
      ref.current.click();
      }
      setPending(false)
      refresh();
      }
        }
        const handleSubscribe=async()=>{
            if(!user||!checkPermissionToDoAction(user,ticket)){  
          toast.error("vous pouvez pas procéder a cette action (ticket est prise en charge par a une autre compte)")
        return;
        }
        setPending(true)
        if(ticket.status!=="open"){
          toast.error(`les status de ticket: (${ticket.status}), vous pouvez pas ajouter une organisation`)
          return
        }
        const organisationFilter=organisations.filter(o=>o.name===organisation);
        if(ticket._id&&organisationFilter&&Array.isArray(organisationFilter)&&organisationFilter.length>0&&organisations.filter(o=>o.name===organisation).at(0)?._id){
          const organisationId=organisations.filter(o=>o.name===organisation).at(0)?._id;
          if(organisationId){
      await  subscribeOrganisationAction(ticket._id,`${user?.name} a ajouter ${organisation} \n${message}`,organisationId);
          }
          
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
    

     <form {...myform}  action="" className='my-4 w-full h-full px-4 flex flex-col gap-8'>
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
                  
                 

                 <p className='text-sm hover:cursor-pointer'  onClick={()=>setAction("")}>
                    Actions
                  </p>
                  { Object.entries(actions).map((val) => (
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val[0]} value={val[0]||"---"}>
                      {val[1]}
                    </SelectItem>
                  ))}
                  
                </SelectContent>
                
              </Select>
                </div>
                {action==="subscribe"&&
                <SelectWithSearch label='Organisation' name='' onValueChange={(o)=>setorganisation(o)} value={organisation} possibleValues={organisations.map(o=>o.name)} />
                 }
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

const getPermissableActions=(user:User|null,ticket:ticket)=>{

const actions:Record<string, string>={comment:"Commenter"};
 if(!user)return actions;
const role=user.role||"standard";
const userOrgaisation=user.organisation;
const ticketORganisation=ticket.recipientOrganization?._id;
 console.log(userOrgaisation)
 console.log(ticketORganisation)
if(ticket.status==="pending"){
  if(role==="admin"||userOrgaisation===ticketORganisation){
 actions["in_charge"]="Pris en charge";
 
  }
 

}
if(ticket.status==="open"){
   console.log(user._id)
   console.log(ticket.assignedTo?.user._id)
   if(role==="admin"||user._id===ticket.assignedTo?.user._id){

actions["subscribe"]="Ajouter une organisation";
actions["close"]="Traiter";
actions["relancer"]="Relancer";
   }

}
return actions;
}

export default AddCommentSheetContent;