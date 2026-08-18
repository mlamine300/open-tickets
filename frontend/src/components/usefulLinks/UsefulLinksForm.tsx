import { addUsefulLinkAction, updateUsefulLinkAction } from '@/actions/usefulLinksAction';
import { usefulLinksSchema, type usefulLinksFormType, type UsefulLinkType } from '@/types';
import { uploadFile } from '@/utils/UploadAttachement';
import { zodResolver } from '@hookform/resolvers/zod';
import  { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import Input from '../ui/Input';
import AddAttachement from '../ticket/AddAttachement';
import Button from '../ui/Button';

const UsefulLinksForm = ({usefullLink}:{usefullLink:UsefulLinkType|null}) => {

       
  
  const [loading, setLoading] = useState(false);
    const isToEdit=usefullLink!==null;
   const form = useForm<usefulLinksFormType>({
      resolver: zodResolver(usefulLinksSchema),
      defaultValues: {
       name:usefullLink?.name||"",
       link:usefullLink?.link||"",
       description:usefullLink?.description||"",
       
      
      },
    })

    const { reset, handleSubmit } = form
        const onSubmit=async(values:usefulLinksFormType)=>{
          setLoading(true);
         isToEdit? updateLink(values):addLink(values)
          
        
        }

        const addLink=async(values:usefulLinksFormType)=>{
             try {
            let imageLink="";
              const attachmentFile=form.getValues("imageLink");
              if (attachmentFile) {
                const attachmentResponse = await uploadFile(attachmentFile);
                //console.log(attachmentResponse);
                imageLink = attachmentResponse.fileUrl ?? "";
                
              }
             const res= await addUsefulLinkAction({name:values.name,link:values.link,imageLink,description:values.description});
             if(res) reset();
          } catch (error:any) {
            console.log(error)
            
          }finally{
      setLoading(false);
      
          }
          
        }

        const updateLink=async(values:any)=>{
            if(!usefullLink?._id){
                toast.error("lien n'a pas été modifié ")
                return;
            }
              try {
            let imageLink="";
              const attachmentFile=form.getValues("imageLink");
              if (attachmentFile) {
                const attachmentResponse = await uploadFile(attachmentFile);
                //console.log(attachmentResponse);
                imageLink = attachmentResponse.fileUrl ?? "";
                
              }
              let data:any={};
              if(values.name&&values.name!==usefullLink.name)data["name"]=values.name;
              if(values.link&&values.link!==usefullLink.link)data["link"]=values.link;
              if(values.description&&values.description!==usefullLink.description)data["description"]=values.description;
              if(imageLink&&imageLink!==usefullLink.imageLink)data["imageLink"]=imageLink;
              if(data&&Object.keys(data).length>0){
                const res= await updateUsefulLinkAction(usefullLink?._id,data);
                 if(res) reset();
              }
            
             
            
          } catch (error:any) {
            console.log(error)
            
          }finally{
      setLoading(false);
      
          }
        }
  return (
   

    
    <Card className="max-w-2xl  mt-10  bg-background-base shadow-2xl rounded-xl border-none">
     {!isToEdit&& <CardHeader>
        <CardTitle>
          Créer un lien utile
        </CardTitle>
      </CardHeader>}

      <CardContent>

 <Form  {...form}>
          <form  onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-2 lg:grid  lg:grid-cols-2 gap-x-2 lg:gap-x-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <Input inputClassName='text-xs' parentClassName="gap-1 items-start" containerClassName=' w-full'  label="Nom" type="text" placeHolder="page facebook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

 <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <Input  inputClassName='text-xs' parentClassName="gap-1 items-start" containerClassName=' w-full'  label="Lien" type="text" placeHolder="https://www.____.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

  <FormField 
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  
                  <FormControl>
                    <Input parentClassName="gap-1 items-start" inputClassName='text-xs min-h-26' containerClassName='w-full'  label="Description" type="area" placeHolder="cette page est ...." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageLink"
              render={({ field }) => (
                <FormItem className='col-span-2 flex items-center'>
                  
                  <FormControl>
                    <AddAttachement className='w-full' labelClassName={"w-full flex text-xs italic "}  label="Image" image={form.watch(field.name)} setImage={(image:any)=>form.setValue(field.name,image)}/>
         
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              
             

               


            {/* Submit */}
            <div className="flex justify-center gap-3 col-span-2">
              <Button className="px-4" variant="primary" text={isToEdit  ? "Modifier Le Lien" :"Ajouter Le Lien" }  type="submit" disabled={loading}/>
                
              
            </div>
            
          </form>
        </Form>


        </CardContent>
        </Card>
        
  )
}

export default UsefulLinksForm
