/*
 name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organisation:{type:Schema.Types.ObjectId,ref:"Organisation" , required:true},
    organisationsList:[{type:Schema.Types.ObjectId,ref:"Organisation"}],
    role: { type: String, enum: ["admin", "standard","supervisor"], default: "standard" },
    refreshTokens: [RefreshTokenSchema],
    activeStatus: { type: Boolean, default: true },
*/

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

  creator:string;
  emitterOrganizationId:string;
  recipientOrganizationId:string;
    associatedOrganizations?:string[];
    type:string;
    status?:string;
    priority?:string;
    pj?:any;
    message:string;
    commentsId:string[];
    specialFeilds?:{name:string;value:any}[]
    updatedAt?:Date;
}

export interface Comment{
  ticketId:string;
  authorId:string;
  message:string;

}


