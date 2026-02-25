import type { ticket, User } from "@/types"

export const checkPermissionToTakeInCharge=(user:User,ticket:ticket)=>{
    const organisation=user.organisation||"";
    const role=user.role||"standard";
    
    return ticket.recipientOrganization?._id===organisation||role==="admin";
}
export const checkPermissionToDoAction=(user:User,ticket:ticket)=>{
    
    const role=user.role||"standard";
    return ticket.assignedTo?.user._id===user._id||role==="admin";
}
export const checkPermissionToRelanceOrClotorer=(user:User,ticket:ticket)=>{
    
    const role=user.role||"standard";
    
    return ticket.creator?._id===user._id||role==="admin";
}