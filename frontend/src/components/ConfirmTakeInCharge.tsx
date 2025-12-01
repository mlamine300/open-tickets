import Button from '@/components/ui/Button';
import React from 'react';

const ConfirmAction = ({action,setShowModal,header}:{action:any,setShowModal:any,header:string}) => {
  return (
    <div className='flex flex-col gap-4 justify-between my-8 h-8/12'>
          <p>{header}</p>
          <div className='flex mx-10 justify-between items-center'>
            <Button variant='primary' className='bg-red-400 px-2 py-1 hover:bg-red-400/50' text='Non' onClick={()=>setShowModal("")} />
            <Button variant='primary' className='px-2 py-1' text='Oui' onClick={()=>action()}/>
          </div>
          </div>
  );
};

export default ConfirmAction ;