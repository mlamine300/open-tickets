import Button from '@/components/ui/Button';
import React from 'react';

const ConfirmTakeInCharge = ({handleTakeInCharge,setShowModal}:{handleTakeInCharge:any,setShowModal:any}) => {
  return (
    <div className='flex flex-col gap-4'>
          <p>Êtes-vous sûr de vouloir prendre en charge ce ticket</p>
          <div className='flex mx-10 justify-between items-center'>
            <Button variant='primary' className='bg-red-400' text='Non' onClick={()=>setShowModal("")} />
            <Button variant='primary' text='Oui' onClick={()=>handleTakeInCharge()}/>
          </div>
          </div>
  );
};

export default ConfirmTakeInCharge ;