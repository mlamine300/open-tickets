import type { JwtPayload } from "jsonwebtoken";
import { Organisation } from "../../../types/index.ts";

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: "admin" | "standard"|"supervisor";
  organisation:string;
  organisationsList:string[];
  activeStatus:boolean;
  iat?: number;
  exp?: number;
}
