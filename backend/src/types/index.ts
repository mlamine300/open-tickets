import type { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: "admin" | "standard"|"supervisor";
  iat?: number;
  exp?: number;
}
