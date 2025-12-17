

import { useEffect, useState } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"



import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


import { useParams } from "react-router"
import { UserSchema, type Organisation, type userFormType } from "@/types"
import { addUserAction, getUserByidAction, updateUserAction } from "@/actions/userAction"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import SelectWithSearch from "@/components/ui/SelectWithSearch"
import { getAllorganisationsAction } from "@/actions/organisationAction"
import SelectMultiple from "@/components/ui/SelectMultiple"
import toast from "react-hot-toast"

export default function UserFormPage() {
  const params = useParams()
  const id = (params?.id as string) || "new"

  const [loading, setLoading] = useState(false)
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      if (id !== "new") {
        setLoading(true)
        const userRes = await getUserByidAction(id)
        if (userRes) {
          reset({
            ...userRes,
            organisation:userRes.organisation.name,
            organisationsList:userRes.organisationsList?.map((o:any)=>o.name),
            password: "",
            rePassword: "",
             } as userFormType)
         
        }
        setLoading(false)
      }
    }
    const fetChOrganisations=async()=>{
        
        const organisationRes=await getAllorganisationsAction();
        
        setOrganisations(organisationRes);
        
        
    }
    fetChOrganisations();
    fetchUser();
   
  }, [id])
  const form = useForm<userFormType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      organisation: "",
      organisationsList: [],
      password: "",
      rePassword: "",
      role: "standard",
    },
  })

  const { reset, handleSubmit } = form
//console.log(form.getValues())


  const onSubmit = async (values: userFormType) => {
    //values.organisation=organisations.filter(o=>o.name===values.organisation).at(0)?._id||"";
    if(values.password&&values.password!==values.rePassword){
        toast.error("Les deux mots de passe ne correspondent pas.")
        return;
    }
    const valueTopatch={
        name:values.name,
        email:values.email,
        password:values.password,
        organisation:organisations.filter(o=>o.name===values.organisation).at(0)?._id||"",
        organisationsList:organisations.filter(o=>values.organisationsList.includes(o.name)).map(or=>or._id||""),
        role:values.role
    };
    if(id==="new"){
       const user= await addUserAction(valueTopatch);
       if(user&&user.name)toast.success(`utilisateur ${user.name} a été créer`);
    }else{
        const user=await updateUserAction(id,valueTopatch);
        if(user&&user.name)toast.success(`utilisateur ${user.name} a été modifier`);
    }
   // console.log("FORM VALUES", values)
    // create or update action here
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
       {organisations&&organisations.length && <Form  {...form}>
          <form  onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-2 lg:grid  lg:grid-cols-2 gap-x-2 lg:gap-x-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <Input parentClassName="gap-1 items-start"  label="Nom" type="text" placeHolder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
               
                  <FormControl>
                    <Input parentClassName="gap-1 items-start" label="Email" type="email" placeHolder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organisation */}
            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem>
                 <FormLabel>Organisation </FormLabel>
                  <FormControl>
                               <SelectWithSearch label="Organisation"
                                name={field.name}
                                 value={form.watch(field.name)} onValueChange={(v)=>{form.setValue(field.name,v)}} possibleValues={organisations.map(o=>o.name)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              
            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={(e)=>{
                    field.onChange(e);
                    form.setValue("organisationsList",[])
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-11/12">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background-base">
                      <SelectItem className="cursor-pointer" value="standard">Standard</SelectItem>
                      <SelectItem className="cursor-pointer" value="admin">Admin</SelectItem>
                      <SelectItem className="cursor-pointer" value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                   
                  </FormLabel>
                  <FormControl>
                    <Input parentClassName="items-start gap-1" labelClassName={id !== "new"?"text-xs font-regular italic":""}  
                    label={` Mot de passe ${id !== "new" ? "(laisser vide pour maintenir le courant)" :""}`}
                     placeHolder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Re Password */}
            
            <FormField
              control={form.control}
              name="rePassword"
              render={({ field }) => (
                <FormItem>
                  
                  <FormControl>
                    <Input   parentClassName="items-start gap-1"  label="Confirmer Mot de passe" placeHolder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("role")==="supervisor"&&<FormField
                
              control={form.control}
              name="organisationsList"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 lg:mx-8">
                 <FormLabel>Organisation List</FormLabel>
                  <FormControl>
                               <SelectMultiple label="Organisation"
                                name={field.name}
                                 value={form.watch(field.name)} onValueChange={(v)=>{form.setValue("organisationsList",v)}} possibleValues={organisations.map(o=>o.name)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}

            {/* Submit */}
            <div className="flex justify-center gap-3 col-span-2">
              <Button className="px-4" variant="primary" text={id === "new" ? "Ajouter Utilisateur" : "Modifier Utilisateur"}  type="submit" disabled={loading}/>
                
              
            </div>
          </form>
        </Form>}
      </CardContent>
    </Card>
    </div>
  )
}
