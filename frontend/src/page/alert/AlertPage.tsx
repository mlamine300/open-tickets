import { addInfo, removeInfo } from "@/actions/infoAction";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Input from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";


const AlertPage = () => {
      const form = useForm<{message:string,isLatin:boolean}>({
        resolver:zodResolver(z.object({message:z.string(),isLatin:z.boolean()})),
        defaultValues: {
          message: "",
          isLatin:true
         
        },
      })
    const handleSave=async({message,isLatin}:{message:string,isLatin:boolean})=>{
      //  e.preventDefault();
         
        if(!message||message===""){
           removeInfo();
            //toast.success("alert désactivated")
        }else {
            //toast.success("Message Ajouté")
            addInfo({message,isLatin})
        }
    }
  return (
    <div className="w-full h-full flex justify-start">
       <Card className="max-w-2xl  mt-10  bg-background-base shadow-2xl rounded-xl border-none w-full">
      <CardHeader>
        <CardTitle>
          Ajouter une barre d'annonce
          
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form  {...form}>

     <form className="flex flex-col gap-8" onSubmit={form.handleSubmit(handleSave)}>

        <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                   
                    <Input  label="Message :" placeHolder="Écrit votre message pour annoncer ou laissez vide pour désactiver l'annonce"
                     type="area"{...field} />

                   
                     </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>

     <FormField
              control={form.control}
              name="isLatin"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                   <div className="flex gap-4 items-center">
                    <p className="underline">Orientation de texte:</p>

                    <Select 
                value={form.watch(field.name) ?"Latin":"Arabe"}
                onValueChange={(value) => form.setValue(field.name, value==="Latin")}
                >
                
                <SelectTrigger className={"w-full lg:max-w-36"}>
                  <SelectValue  placeholder={"Sélectionner l'orientation de texte"} />
                  
                </SelectTrigger>
                
                
                <SelectContent  id={`select-orientation`} className="bg-background-base ">
                  
                 

                      <SelectItem className="cursor-pointer hover:bg-gray-hot" key={"latin"} value={"Latin"}>
                      Latin
                    </SelectItem>
                     <SelectItem className="cursor-pointer hover:bg-gray-hot" key={"arabe"} value={"Arabe"}>
                      Arabe
                    </SelectItem>
                 
                  
                  
                </SelectContent>
                
              </Select>

                  </div>
                   
                     </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
     
          <Button text={form.watch("message")?"Modifier l'annonce":"Désactiver l'annonce"} variant="primary" type="submit" /> 
     </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  )
}

export default AlertPage
