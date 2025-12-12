/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
 import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";
 import Button from "../../components/ui/Button";

import { Link, useNavigate } from "react-router";
import { validateEmail, validatePassword } from "../../../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../data/apiPaths";
import { useUserContext } from "../../context/user/userContext";
import { AxiosError } from "axios";


import { tokenService } from "@/utils/tokenService";

const Login = () => {
  const [email, setEmail] = useState<string>("user2@example.com");
  const [password, setPassword] = useState<string>("lamine123");
  const [error, setError] = useState<any>({});
  const [pending, setpending] = useState(false);
  const { updateUser, user } = useUserContext();
console.log(user);
  const navigate = useNavigate();
  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError((err: any) => {
        return { ...err, email: "Please enter a valid email address." };
      });
      return;
    }
    if (!validatePassword(password)) {
      setError((err: any) => {
        return { ...err, password: "Please enter a valid password." };
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
        console.log(response.data);
        const token = response.data.token;
        // localStorage.setItem("token", token);
       tokenService.setToken(token);
        localStorage.setItem("role", response.data.role);
        console.log(response.data);
        
        updateUser(response.data);

        
          navigate("/");
        
      }
    } catch (error: any) {
      console.log(error);
      let errResponse = "error on the server";
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
        <h3>Welcome Back</h3>
        <p className="text-secondary">Please enter your details to log in</p>
        <form className="flex flex-col gap-5 max-w-[500px]">
          <Input
            key="email"
            placeHolder="name@xmail.com"
            label="Email Address"
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
            label="Password"
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
            text={"LOGIN"}
            variant="primary"
            onClick={handleLogin}
          />
        
          {error?.login && (
            <p className="text-sm text-red-500">{error.login}</p>
          )}
        </form>
        <p className="mt-4">
          Don't have an account?{" "}
          <Link
            className="cursor-pointer text-primary underline hover:font-semibold"
            to={"/signup"} 
          >
            SignUp
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;