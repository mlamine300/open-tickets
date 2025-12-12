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
  id?: string;
  name: string;
  email: string;
  organisation: string;
  organisationsList?: string[];
  password?: string;
  role?: string;
  token: string;
  createdAt?: Date;
  activeStatus?: boolean;
}
export interface FormFieldType{
      name:string;
      label:string;
      type:"text"|"number"|"select"|"date"|"select-multiple"|"area"|"select-filter"|"list";
      possibleValues?:string[];
      default?:string;
    required:boolean;}
export interface FormType{
  _id?:string;
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
  _id?:string;
  creator?:{email:string,name:string,_id:string};
  ref:string;
  emitterOrganizationId:string;
  recipientOrganizationId:string;
  emitterOrganization?:{name:string,_id:string};
  recipientOrganization?:{name:string,_id:string};
    associatedOrganizations?:{name:string,_id:string}[];
    type:string;
    status?:string;
    priority?:string;
    pj?:any;
    message:string;
    commentsId:string[];
    specialFields?:any;
    assignedTo?:{user:{name:string;email:string;_id:string};date:Date}
    AssignementHistory?:{name:string;date:Date}[]
    updatedAt?:Date;
    formName?:string;
    lastComment?:Comment;
}

export interface Comment{
  author?:{_id:string,name:string,email:string}
  ticketId:string;
  ticketRef?:string;
  authorId?:string;
  message:string;
  action:string;
  createdAt:Date;

}


