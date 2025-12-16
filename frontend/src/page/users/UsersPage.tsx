import { getAllorganisationsAction } from "@/actions/organisationAction";
import { getUsersAction } from "@/actions/userAction";
import TablePagination from "@/components/ticket/TablePAgination";
import { Card } from "@/components/ui/card";
import { columns } from "@/components/user/columns";
import { DataTable } from "@/components/user/data-table";
import FilterTableDiv from "@/components/user/FilterTableDiv";
import type { Organisation, User } from "@/types";
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router";

function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [pending, setPending] = useState(false);
    const [organisations, setOrganisations] = useState<Organisation[] >([]);
    const x=useSearchParams();
    const searchParams=x[0];
    const page=searchParams.get("page")||1;
    const organisationId=searchParams.get("organisation");
    const type=searchParams.get("type");
    const search=searchParams.get("search");
    useEffect(()=>{
       
        const fetchUsers=async()=>{
             setPending(true)
            const res=await getUsersAction({page,maxPerPage:5,organisationId,role:type,search});
            if(res){
                setUsers(res);
                console.log(res);}
            
         setPending(false);
            }
            const fetchOrganisation=async()=>{
                const organisationsRes=await getAllorganisationsAction();
                if(organisationsRes)setOrganisations(organisationsRes);
            }
        fetchUsers();
        fetchOrganisation();
       
    },[page,type,organisationId,search])
    return (
        <div className="flex w-full h-full">
            <Card className='flex item-center bg-background-base border-none shadow-2xl w-full p-5 min-h-screen justify-start'>
               <FilterTableDiv organisations={organisations}/>
                <DataTable pending={pending} columns={columns()} data={users} />
                 <TablePagination maxPages={Math.ceil(5)} className='mt-auto ml-auto gap-2 p-5'/>
            </Card>
            
        </div>
    )
}

export default UsersPage
