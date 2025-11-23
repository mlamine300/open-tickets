import type { User } from "../../../types/index";

// tokenService.ts
let accessToken: string | null = null;
let updateUserFn: ((u: User) => void) | null = null;

export const tokenService = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token: string) => (localStorage.setItem("token", token)),
  setUpdateUser: (fn: (u: User) => void) => (updateUserFn = fn),
  updateUser: (u: User) => updateUserFn?.(u),
};
