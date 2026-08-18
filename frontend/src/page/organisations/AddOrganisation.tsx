import { addOrganisationAction, getOrganisationByid, updateOrganisationAction } from "@/actions/organisationAction";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem,  FormMessage } from "@/components/ui/form";
import Input from "@/components/ui/Input";
import SelectWithSearch from "@/components/ui/SelectWithSearch";
import { getWilayas } from "@/data/data";
import { organisationSchema, type Organisation, type organisationFormType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";



const AddOrganisation = () => {
  const params = useParams()
  const id = (params?.id as string) || "new"
  const wilayas=getWilayas();
  const [loading, setLoading] = useState(false)
  const navigate=useNavigate();
  useEffect(() => {
    const fetchOrganisation = async () => {
      if (id !== "new") {
        setLoading(true)
        const organisation = await getOrganisationByid(id) as Organisation
        if(organisation){
            reset({
                ...organisation
            })
        }
   
        setLoading(false)
      }else {
        reset({
          name:"",
          address:"",
          description:"",
          head:"",
          wilaya:"",
          phone:"",
          active:false
        })
      }
    }
  
    
    fetchOrganisation();
   
  }, [id])
  
  const form = useForm<organisationFormType>({
    resolver: zodResolver(organisationSchema),
    defaultValues: {
     name:"",
  wilaya:"",
  address:"",
  phone:"",
  head:"",
  description:"",
  active:true,
    },
  })

  const { reset, handleSubmit } = form
//console.log(form.getValues())


  const onSubmit = async (values: Organisation) => {
    
    const valueTopatch={
        name:values.name,
        wilaya:values.wilaya,
        description:values.description,    
        address:values.address,
        phone:values.phone,
        head:values.head,
        active:values.active
 
    };
    if(id==="new"){
       const organisation= await addOrganisationAction(valueTopatch);
       if(organisation&&organisation.name){
        
      form.reset({
       name:"",
  wilaya:"",
  address:"",
  phone:"",
  head:"",
  description:"",
  active:true,
}
    )
      }
    }else{
        
        const organisation=await updateOrganisationAction(id,valueTopatch);
        if(organisation&&organisation.name) {

          toast.success(`organisation ${organisation.name} a été modifier`);
          navigate("/organisations/list")
        }
    }
   // console.log("FORM VALUES", values)
    // create or update action here
  }

  return (
    <div className="w-full h-full flex justify-start">

    
    <Card className="max-w-2xl  mt-10  bg-background-base shadow-2xl rounded-xl border-none">
      <CardHeader>
        <CardTitle>
          {id === "new" ? "Créer un Organisation" : "Modifier un Organisation"}
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
                    <Input parentClassName="gap-1 items-start"  label="Nom" type="text" placeHolder="Station oued semar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              
              <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <Input  parentClassName="gap-1 items-start"  label="Addresse" type="text" placeHolder="cité X N 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

                 <FormField
              control={form.control}
              name="wilaya"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    {/* <Input  parentClassName="gap-1 items-start"  label="Wilaya" type="select-filter"  placeHolder="Alger" {...field} /> */}
                  <div className={"bg-background-base flex flex-col items-start gap-2"}>
                <label className={' text-sm'} htmlFor={`select-${field.name}`}>Wilaya </label>
           
                  <SelectWithSearch  label="Wilaya" name={field.name} value={field.value} onValueChange={(v)=>form.setValue("wilaya",v)} possibleValues={wilayas}  />
                 </div>
                  </FormControl>
                  <FormMessage />
                  
                </FormItem>
              )}
            />
                <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <Input  parentClassName="gap-1 items-start"  label="Phone" type="text" placeHolder="0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           {id!=="new"&&<FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <div className={"bg-background-base flex flex-col items-start gap-2"}>
                <label className={' text-sm'} htmlFor={`select-${field.name}`}>Active </label>
                    <SelectWithSearch  possibleValues={["Oui","Non"]} label="Active"  name={field.name} value={form.watch("active")?"Oui":"Non"} onValueChange={(s:string)=>form.setValue("active",s==='Oui')} />
                         </div>
                         </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> }


            {/* Submit */}
            <div className="flex justify-center gap-3 col-span-2">
              <Button className="px-4" variant="primary" text={id === "new" ? "Ajouter Organisation" : "Modifier Organisation"}  type="submit" disabled={loading}/>
                
              
            </div>
            
          </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  )
}

export default AddOrganisation
