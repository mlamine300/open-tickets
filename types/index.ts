export interface SimpleMenuItemType {
    id: string;
    label: string;
    icon: any;
    path: string;
}

export interface MenuItemType{
  
    id: string;
    label: string;
    icon: any;
    path: string;
    hasChilds:boolean;
    childs?:SimpleMenuItemType[];
  
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  organisation: string;
  organisationsList?: string[];
  password?: string;
  role?: string;
  tokenC: string;
  createdAt?: Date;
  activeStatus?: boolean;
}
export interface FormFieldType{
      name:string;
      label:string;
      type:"text"|"number"|"select"|"date"|"select-multiple"|"area";
      possibleValues?:string[];
    required:boolean;}
export interface FormType{_id:string;
  name:string;
  description:string;
    fields:FormFieldType[]}
export type priorityLevel = "Low" | "Medium" | "High";
export type statusType = "Pending" | "In Progress" | "Completed";

export interface Organisation{
  _id?:string;
  name:string;
   head?:string;
    address?:string;
     description?:string;
   
}

export interface ticket{
  _id:string;
  creator:string;
  ref:string;
  emitterOrganizationId:string;
  recipientOrganizationId:string;
  emitterOrganization?:string;
  recipientOrganization?:string;
    associatedOrganizations?:string[];
    type:string;
    status?:string;
    priority?:string;
    pj?:any;
    message:string;
    commentsId:string[];
    specialFeilds?:{name:string;value:any}[]
    assignedTo?:{user:{name:string;email:string};date:Date}
    AssignementHistory?:{name:string;date:Date}[]
    updatedAt?:Date;
}

export interface Comment{
  ticketId:string;
  authorId:string;
  message:string;

}


