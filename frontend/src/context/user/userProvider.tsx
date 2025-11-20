import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import type { User } from "../../../../../types/index";
import { userContext } from "./userContext";
import { tokenService } from "../../utils/tokenService";

const UserProvider = ({ children }: { children: React.ReactElement }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const token = tokenService.getToken();
    if (!token) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get<User>(
          API_PATH.AUTH.GET_PROFILE
        );
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData: User) => {
    setUser(userData);
    if (userData.token) {
      // localStorage.setItem("token", userData.token);
      tokenService.setToken(userData.token);
    }
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <userContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
