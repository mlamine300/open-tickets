import type { ticket, User } from "@/types"

export const checkPermission=(user:User,ticket:ticket)=>{
    const organisation=user.organisation||"";
    const role=user.role||"standard";
    return ticket.recipientOrganizationId===organisation||role==="admin";
}