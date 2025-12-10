import type { User } from "@/types";

// tokenService.ts

let updateUserFn: ((u: User) => void) | null = null;

export const tokenService = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token: string) => (localStorage.setItem("token", token)),
  setUpdateUser: (fn: (u: User) => void) => (updateUserFn = fn),
  updateUser: (u: User) => updateUserFn?.(u),
};
