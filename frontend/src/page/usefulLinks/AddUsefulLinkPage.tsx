import { addUsefulLinkAction } from "@/actions/usefulLinksAction"
import AddAttachement from "@/components/ticket/AddAttachement"
import Button from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import Input from "@/components/ui/Input"
import { usefulLinksSchema, type usefulLinksFormType } from "@/types"
import { uploadFile } from "@/utils/UploadAttachement"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import {  useForm } from "react-hook-form"
import { useParams } from "react-router"


const AddUsefulLinkPage = () => {
   const params = useParams()
  const id = (params?.id as string) || "new"
  const [loading, setLoading] = useState(false);

   const form = useForm<usefulLinksFormType>({
      resolver: zodResolver(usefulLinksSchema),
      defaultValues: {
       name:"",
       link:"",
       description:""
      
      },
    })
const { reset, handleSubmit } = form
    const onSubmit=async(values:usefulLinksFormType)=>{
      setLoading(true);
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


  return (
    <div className="w-full h-full flex justify-start">

    
    <Card className="max-w-2xl  mt-10  bg-background-base shadow-2xl rounded-xl border-none">
      <CardHeader>
        <CardTitle>
          {id === "new" ? "Créer un Utilisateur" : "Modifier un Utilisateur"}
        </CardTitle>
      </CardHeader>

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
                    <Input parentClassName="gap-1 items-start"  label="Nom" type="text" placeHolder="page facebook" {...field} />
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
                    <Input parentClassName="gap-1 items-start"  label="Lien" type="text" placeHolder="https://www.____.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

  <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <Input parentClassName="gap-1 items-start"  label="Description" type="area" placeHolder="cette page est ...." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageLink"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <AddAttachement labelClassName={"w-full flex text-xs italic "}  label="Image" image={form.watch(field.name)} setImage={(image:any)=>form.setValue(field.name,image)}/>
         
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              
             

               


            {/* Submit */}
            <div className="flex justify-center gap-3 col-span-2">
              <Button className="px-4" variant="primary" text={id === "new" ? "Ajouter Le Lien" : "Modifier Le Lien"}  type="submit" disabled={loading}/>
                
              
            </div>
            
          </form>
        </Form>


        </CardContent>
        </Card>
        </div>
  )
}

export default AddUsefulLinkPage
