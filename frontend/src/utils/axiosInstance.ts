/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINT } from "../data/apiPaths";
import { tokenService } from "./tokenService";

/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // ✅ Resolve promises for 4xx, reject only 5xx & network errors
  validateStatus: (status) => status < 500,
});

/* -------------------------------------------------------------------------- */
/*                           REFRESH TOKEN CONTROL                            */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

/* -------------------------------------------------------------------------- */
/*                           REQUEST INTERCEPTOR                              */
/* -------------------------------------------------------------------------- */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* -------------------------------------------------------------------------- */
/*                          RESPONSE INTERCEPTOR                              */
/* -------------------------------------------------------------------------- */

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    const status = response.status;

    /* --------------------------- ACCESS TOKEN EXPIRED --------------------------- */
    if (status === 461) {
      return  handleRefresh(response);
    }

    /* --------------------------- REFRESH TOKEN INVALID -------------------------- */
    if (status === 462) {
      tokenService.setToken("");
      window.location.href = "/login";
      return response;
    }

    return response;
  },

  /* --------------------------- NETWORK / 5XX ERRORS ---------------------------- */
  async (error: AxiosError) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout.");
    }

    if (!error.response) {
      console.error("Network error.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

/* -------------------------------------------------------------------------- */
/*                              REFRESH FUNCTION                              */
/* -------------------------------------------------------------------------- */

const handleRefresh = async (response: AxiosResponse): Promise<AxiosResponse> => {
  const originalRequest: any = response.config;

  if (!originalRequest) return response;

  // Prevent infinite retry loop
  if (originalRequest._retry) {
    return response;
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token: string) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          resolve(axiosInstance(originalRequest));
        },
        reject,
      });
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const refreshResponse = await axiosInstance.post(
      "/api/auth/refresh",
      {},
      { withCredentials: true }
    );

    if (refreshResponse.status === 462) {
      tokenService.setToken("");
      window.location.href = "/login";
      processQueue(new Error("Invalid refresh token"), null);
      return refreshResponse;
    }

    const newToken = refreshResponse.data?.accessToken;

    if (!newToken) {
      throw new Error("No access token returned from refresh.");
    }

    tokenService.setToken(newToken);

    axiosInstance.defaults.headers.common.Authorization =
      "Bearer " + newToken;

    processQueue(null, newToken);

    originalRequest.headers.Authorization = "Bearer " + newToken;

    return axiosInstance(originalRequest);
  } catch (error) {
    processQueue(error, null);
    tokenService.setToken("");
    window.location.href = "/login";
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};