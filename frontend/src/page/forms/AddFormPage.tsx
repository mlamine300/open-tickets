import { standardForm } from "@/utils/data";
import { useState } from "react";
import type { FormFieldType, FormType } from "../../../../types";
import Input from "@/components/ui/Input";
import DashboardLayout from "@/layouts/DashboardLayout";
import DynamicForm from "@/components/Formulaire";
import { buildZodFormSchema } from "@/utils/zod";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import AddFieldMenu from "@/components/AddFieldMenu";


const AddFormPage = () => {
    
    const [form,setForm]=useState<FormType>({name:"",description:"",fields:[]})
    const [showModal,setShowModal]=useState(false);
    const addFunction=(data:FormFieldType)=>{
      console.log();
      
    }
  return (
    <DashboardLayout>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full w-11/12 min-h-screen min-w-[1080px]">
      <div className="flex items-start flex-col gap-2 w-full h-full">
        
        <Input parentClassName="items-start gap-0 w-full" containerClassName="w-8/12" labelClassName="italic text-xs font-semibold " inputClassName="text-xs w-full" label="Nom de Formulaire" placeHolder="colis perdus.." type="text" value={form.name}
         onChange={(e)=>setForm(f=>{return{...f,name:e.target.value}})} />
          <Input parentClassName="items-start gap-0 w-full" containerClassName="w-8/12" labelClassName="italic text-xs font-semibold " label="Descriptions" placeHolder="description.." type="area" value={form.description}
         onChange={(e)=>setForm(f=>{return{...f,description:e.target.value}})} />
        <Button text="Ajouter un champ de saisie" variant="primary" className="self-center" onClick={()=>setShowModal(true)}/>

      </div>
      <div className="w-full flex-col gap-4 bg-background-base h-full">
        <p className="italic text-lg font-semibold">{form.name}</p>
      <DynamicForm form={form} />
      </div>
    </div>
    <Modal close={()=>setShowModal(false)} showModal={showModal} title="Ajouter un champs" >
      <AddFieldMenu addFunction={addFunction} />
    </Modal>
    </DashboardLayout>
  );
};

export default AddFormPage;