import React, { useRef, useState } from 'react';
import { SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import type { ticket } from '../../../types';
import { Select, SelectContent, SelectItem, SelectValue,SelectTrigger } from './ui/select';
import { COMMENT_ACTIONS, COMMENT_ACTIONS_DICTIONNAIRE } from '@/utils/data';
import Input from './ui/Input';
import Button from './ui/Button';
import { AddComment } from '@/utils/action';
import toast from 'react-hot-toast';

const AddCommentSheetContent = ({ticket}:{ticket:ticket}) => {
    const [action,setAction]=useState<string>("");
    const [message,setMessage]=useState<string>("");
    const ref=useRef<HTMLButtonElement|null>(null);
    const handleComment=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
      if(!message)toast.error("tu devrais ecrir un message"),
      e.preventDefault();
      AddComment(ticket._id,action,message);
      setAction("");
      setMessage("");
      if(ref&&ref.current){
      ref.current.click();
      }
     
    }
  return (
      <SheetContent className='h-full bg-background-base'>
    <SheetHeader>
      <SheetTitle>Ajouter un commentaire</SheetTitle>
    </SheetHeader>
     <form action="" className='my-4 w-full h-full px-4 flex flex-col gap-8'>
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
            
                  <Button type='button' text='Ajouter' variant='primary' onClick={(e)=>{
                    handleComment(e)
                  }} />
                  <SheetClose>
                    <Button type='button'  text='Fermer' ref={ref} variant='outline' className='border-red-500 text-red-500 hover:text-red-300 hover:border-red-400 w-full mt-auto' />
                  </SheetClose>
      </form>
  </SheetContent>
  );
};

export default AddCommentSheetContent;