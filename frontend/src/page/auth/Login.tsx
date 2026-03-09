/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
 import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";
 import Button from "../../components/ui/Button";

import {  useNavigate } from "react-router";
import { validateEmail, validatePassword } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../data/apiPaths";
import { useUserContext } from "../../context/user/userContext";
import { AxiosError } from "axios";


import { tokenService } from "@/utils/tokenService";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<any>({});
  const [pending, setpending] = useState(false);
  const { updateUser } = useUserContext();

  const navigate = useNavigate();
  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError((err: any) => {
        return { ...err, email: "Merci d'entrer votre email" };
      });
      return;
    }
    if (!validatePassword(password)) {
      setError((err: any) => {
        return { ...err, password: "Merci d'entrer votre Mot de passe" };
      });
      return;
    }

    setpending(true);
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });
      if (response.status === 200) {
       
        const token = response.data.token;
        // localStorage.setItem("token", token);
       tokenService.setToken(token);
        localStorage.setItem("role", response.data.role);
        
        const user={...response.data,_id:response.data?.id};
        
        updateUser(user);

        
          navigate("/");
        
      }
    } catch (error: any) {
      console.log(error);
      let errResponse = "error dans le serveur";
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          errResponse = error.response?.data.message;
        }
      }
      setError((err: any) => {
        return { ...err, login: errResponse };
      });

      console.error(error);
    }
    setpending(false);
    // setError({});
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-3 h-[500px] ">
        <h3>Bienvenue</h3>
        <p className="text-secondary">Merci d'entrer vos informations pour ce connecter</p>
        <form className="flex flex-col gap-5 max-w-[500px]">
          <Input
            key="email"
            placeHolder="nom@xmail.com"
            label="Address Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError((err: any) => {
                return { ...err, email: "" };
              });
            }}
            error={error?.email || ""}
          />
          <Input
            key="password"
            placeHolder="Min 8 Characters"
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError((err: any) => {
                return { ...err, password: "" };
              });
            }}
            error={error?.password || ""}
          />

          <Button
            disabled={pending}
            text={"Connexion"}
            variant="primary"
            onClick={handleLogin}
          />
        
          {error?.login && (
            <p className="text-sm text-red-500">{error.login}</p>
          )}
        </form>
        {/* <p className="mt-4">
          Don't have an account?{" "}
          <Link
            className="cursor-pointer text-primary underline hover:font-semibold"
            to={"/signup"} 
          >
            SignUp
          </Link>
        </p> */}
      </div>
    </AuthLayout>
  );
};

export default Login;