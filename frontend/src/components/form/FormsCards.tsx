import type { FormType } from "@/types"
import { Pen, Trash2 } from "lucide-react"
import { Link } from "react-router"

function FormsCards({form,showModal}:{form:FormType,showModal:(id:string)=>void}) {
    return (
         <div className='flex flex-col gap-2 items-center bg-background-base shadow-2xl rounded-lg py-4 px-2 min-w-56 h-64 max-w-[200px] relative'>
       <div className='flex flex-col items-start py-2 justify-center gap-y-5 w-full'>
        
        <h3 className='text-sm font-semibold text-center w-full'>{form.name}</h3>
        <p className='text-xs italic font-light ml-2 text-start'><span className='font-bold text-gray-cold italic '>description :</span> {form.description} </p>
        <div className='text-xs italic font-light ml-2 text-start'><span className='font-bold text-gray-cold italic '>champs :</span>
        <ul className="list-disc list-inside">
            {form.fields.map((field,index)=><li key={index}>{field.label} ({field.type}) {field.required?"*":""}</li>)}
        </ul>   
        </div>
       </div>
        <div className='ml-auto flex gap-4 items-center absolute bottom-3 right-3'>
            
          <Link to={`/forms/${form._id}`} className="p-2 bg-gray-hot/20 rounded-full">
          <Pen  size={15} className='hover:scale-110 cursor-pointer'/></Link>
          <div className="p-2 bg-gray-hot/20 rounded-full">

          <Trash2 onClick={()=>{
            if(form._id)
            showModal(form._id)
          }}     size={15} className='text-red-500 hover:scale-110 hover:text-red-600 hover:-rotate-12 cursor-pointer'/>
          </div>
        </div>
      </div>
    )
}

export default FormsCards
