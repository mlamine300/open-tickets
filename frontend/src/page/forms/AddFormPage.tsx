import {  StandartFierlds } from "@/data/data";
import { useEffect, useState } from "react";
import type { FormFieldType, FormType } from "@/types";
import Input from "@/components/ui/Input";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import AddFieldMenu from "@/components/form/AddFieldMenu";
import toast from "react-hot-toast";
import { addFormAction, editFormAction, getFormByIdAction } from "@/actions/formAction";
import { useLocation, useNavigate, useNavigation, useParams } from "react-router";
import DynamicForm from "@/components/ticket/Formulaire";


const AddFormPage = () => {
    const params=useParams();
    const id=params.id||"new";
    const standartFierlds=StandartFierlds().map(s=>s.name);
    const [form,setForm]=useState<FormType>({name:"",description:"",fields:[]}); 
    const [pending,setPending]=useState(false);
    const [showModal,setShowModal]=useState(false);
    const navigate=useNavigate();

  useEffect(()=>{
    const getForm=async()=>{
      if(id!=="new"){
 const f=await getFormByIdAction(id);
 if(f)setForm(f);
      }
      else if(id==="new"){
     setForm({name:"",description:"",fields:[]});
    }
  }
    getForm();
  },[id])


    const addFunction=(data:FormFieldType)=>{
      
      if(form.fields.filter(f=>f.name===data.name).length>0){
        toast.error(`le nom (${data.name}) existe déja assurer vous que le nom est correct)`)
      return;
      }
 
      form.fields.push(data);
      toast.success("good");

      console.log(form);
      
    }

    const submitFormAdd=async()=>{
      setPending(true); 
      try {
          
          const ret=await addFormAction(form);
          if(ret)setForm({name:"",description:"",fields:[]})
        } catch (error) {
          console.log(error);
          
        }
        setPending(false);
    }
    const submitFormEdit=async()=>{
 setPending(true); 
      try {
          
          const ret=await editFormAction(id,form);
          if(ret)navigate("/forms/list")
        } catch (error) {
          console.log(error);
          
        }
        setPending(false);
    }

  return (
    <div >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 min-h-[60vh]  w-11/12  min-w-[1080px]">
      <div className="flex items-start flex-col gap-2 w-full h-full ">
        
        <Input parentClassName="items-start gap-0 w-full" containerClassName="w-11/12" labelClassName="italic text-xs font-semibold " inputClassName="text-xs w-full" label="Nom de Formulaire" placeHolder="colis perdus.." type="text" value={form.name}
         onChange={(e)=>setForm(f=>{return{...f,name:e.target.value}})} />
          <Input parentClassName="items-start gap-0 w-full" containerClassName="w-11/12" labelClassName="italic text-xs font-semibold " inputClassName="text-xs w-full" label="Descriptions" placeHolder="description.." type="area" value={form.description}
         onChange={(e)=>setForm(f=>{return{...f,description:e.target.value}})} />
        <Button text="Ajouter un champ de saisie" variant="primary" className="self-center" onClick={()=>setShowModal(true)}/>
        <div className="flex flex-wrap gap-2">
          {form.fields.filter(f=>!standartFierlds.includes(f.name))&&form.fields.filter(f=>!standartFierlds.includes(f.name)).map(f=>{
            return <p className="px-4 py-1 rounded bg-primary hover:bg-red-500/50 cursor-pointer" onClick={()=>setForm({...form,fields:form.fields.filter(fild=>fild!==f)})}>{f.name}</p>
          })}
        </div>
      {
id==="new"?<Button disabled={pending} onClick={()=>submitFormAdd()} text="Ajouter le Formulaire" variant="primary" className="w-8/12 mx-auto mt-auto" />
:      <Button disabled={pending} onClick={()=>submitFormEdit()} text="Modifier le Formulaire" variant="primary" className="w-8/12 mx-auto mt-auto" />
} 
      </div>
      <div className="hidden xl:flex w-full flex-col gap-4 bg-background-base h-full">
        
     {(form&&form.fields&&Array.isArray(form.fields)&&form.fields.length)? <DynamicForm form={form} disabled={true} />:
     <div className="flex flex-col items-center my-5 w-full h-full gap-8">
        <h3 className="italic font-extrabold underline">Fomrmulaire vide</h3>
        <p className="text-sm italic text-text-primary/50 font-normal">Ajouter des champs pour créer un fomulaire </p>
     </div>
     }
      </div>
    </div>
    <Modal className="w-10/12 max-w-8/12 min-w-8/12 h-fit pb-20" close={()=>setShowModal(false)} showModal={showModal} title="Ajouter un champs" >
      <AddFieldMenu addFunction={addFunction} />
    </Modal>
    </div>
  );
};

export default AddFormPage;