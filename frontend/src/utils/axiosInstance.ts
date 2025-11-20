/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { API_ENDPOINT } from "./apiPaths";

import { tokenService } from "./tokenService";

let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  );
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err: AxiosError) => {
    console.error("naela ", err.status);
    if (err.response) {
      // if ((err.response.data as any)?.message === "Access token expired")
      if (err.status === 461) {
        console.log("---------------------");
        refreshToken(err);
      } else if (err.status === 462) {
        window.location.href = "/login";
      } else if (err.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (err.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;

const refreshToken = async (err: any) => {
  const originalReq = err.config;
  console.log("refreshing");
  if (err.response && err.response.status === 461 && !originalReq._retry) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalReq.headers["Authorization"] = "Bearer " + token;
        return axiosInstance(originalReq);
      });
    }
    originalReq._retry = true;
    isRefreshing = true;
    //console.log("refresh start....");
    try {
      const res = await axiosInstance.post(
        "/api/auth/refresh",
        {},
        {
          withCredentials: true,
        }
      ); // withCredentials:true set in instance
      // if (
      //   res.status === 462 &&
      //   ((res.data as any).message === "invalid refresh token" ||
      //     (res.data as any).message === "there is no refresh token")
      // ) {
      //   window.location.href = "/login";
      // }
      const newToken = res.data.accessToken;
      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + newToken;
      processQueue(null, newToken);
      tokenService.setToken(newToken);
      // localStorage.setItem("token", newToken);
      // console.log("refresh end");
      return axiosInstance(originalReq);
    } catch (e) {
      processQueue(e, null);
      throw e;
    } finally {
      isRefreshing = false;
    }
  }
};
