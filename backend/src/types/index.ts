import type { JwtPayload } from "jsonwebtoken";


export interface TokenPayload extends JwtPayload {
  userId: string;
  role: "admin" | "standard"|"supervisor";
  organisation:string;
  organisationsList:string[];
  activeStatus:boolean;
  iat?: number;
  exp?: number;
}
export interface FormFieldType{
      name:string;
      label:string;
      type:"text"|"number"|"select"|"date"|"select-multiple"|"area"|"select-filter"|"list";
      possibleValues?:string[];
      default?:string;
    required:boolean;}
