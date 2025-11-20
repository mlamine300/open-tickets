import type { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: "admin" | "member";
  iat?: number;
  exp?: number;
}
