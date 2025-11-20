import { createContext, useContext } from "react";
import type { User } from "../../../../types/index";

export interface UserContext {
  user: User | null;
  loading: boolean;
  updateUser: (u: User) => void;
  clearUser: () => void;
}

const initialState: UserContext = {
  user: null,
  loading: false,
  updateUser: () => {},
  clearUser: () => {},
};

export const userContext = createContext<UserContext>(initialState);

export const useUserContext = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
