import type { User } from "../../../../types";

// tokenService.ts
let accessToken: string | null = null;
let updateUserFn: ((u: User) => void) | null = null;

export const tokenService = {
  getToken: () => accessToken,
  setToken: (token: string) => (accessToken = token),
  setUpdateUser: (fn: (u: User) => void) => (updateUserFn = fn),
  updateUser: (u: User) => updateUserFn?.(u),
};
