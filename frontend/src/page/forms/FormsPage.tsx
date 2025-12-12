import  { useEffect, useState } from 'react';
import type{ FormType } from '@/types';
import { getFormsAction } from '@/actions/formAction';
import { Card } from '@/components/ui/card';
import FormsCards from '@/components/form/FormsCards';

import Modal from '@/components/ui/Modal';

const FormsPages = () => {
  const [forms,setForms]=useState<FormType[]>([]);
  const [modalId,setModalId]=useState<string|null>(null);
  const [showConfirm,setShowConfirm]=useState<boolean>(false);

  const showModal=(id:string)=>{
    setModalId(id);
    setShowConfirm(true);
  }
  const deleteForm=async(id:string)=>{
    //call delete action
    await deleteForm(id)
  }
  

  useEffect(()=>{
    const getForms=async()=>{
   const formsRes=   await getFormsAction();
   setForms(formsRes);
    }
getForms();
  },[])
  return (
    <div >
      <div className='w-11/12  xl:min-w-[1080px] min-h-10/12'>
      <Card className='flex flex-col gap-8 w py-8 px-4 bg-background-base rounded-xl shadow-2xl border-none max-w-[800px] items-center'>
      <h3 className='text-lg font-semibold'>Créer / Editer / Supprimer des formulaires </h3>
      <div className='flex gap-4 w-full flex-wrap justify-start '>
      {forms.map(form=> <FormsCards form={form} showModal={showModal}/>
    )}
      </div>
      </Card>
      </div>
      <Modal showModal={showConfirm} close={()=>setShowConfirm(false)} title="Confirmer la suppression" className='flex flex-col'>

        <p className='mb-auto mt-10'>
          Êtes-vous sûr de vouloir supprimer ce formulaire ? Cette action est irréversible.

        </p>
        <div className='flex gap-4 justify-end mt-4'>
          <button onClick={()=>setShowConfirm(false)} className='px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400'>Annuler</button>
          <button onClick={()=>{
            deleteForm(modalId!);
            setShowConfirm(false);
          }} className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'>Supprimer</button>
        </div>
      </Modal>
    </div>
  );
};

export default FormsPages;