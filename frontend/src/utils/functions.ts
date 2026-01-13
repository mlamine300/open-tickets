import type { ticket, User } from "@/types"

export const checkPermissionToTakeInCharge=(user:User,ticket:ticket)=>{
    const organisation=user.organisation||"";
    const role=user.role||"standard";
    
    return ticket.recipientOrganization?._id===organisation||role==="admin";
}
export const checkPermissionToDoAction=(user:User,ticket:ticket)=>{
    
    const role=user.role||"standard";
    console.log(ticket.assignedTo?.user._id)
    console.log(user._id)
    return ticket.assignedTo?.user._id===user._id||role==="admin";
}