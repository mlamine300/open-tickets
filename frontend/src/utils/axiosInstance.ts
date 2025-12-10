/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { API_ENDPOINT } from "../data/apiPaths";

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
    console.error("axios error response intercepter ", err.status);
    if (err.response) {
      // if ((err.response.data as any)?.message === "Access token expired")
      if (err.status === 462) {
         isRefreshing = false;
  failedQueue = [];        // stop pending retries
  tokenService.setToken(""); 

  window.location.href = "/login";
  return Promise.reject(err); 
      }
     else if (err.status === 461) {
  
       
        return refreshToken(err);
        
        
      }   else if (err.response.status === 500) {
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
/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios, { AxiosError } from "axios";
// import { API_ENDPOINT } from "../data/apiPaths";

// import { tokenService } from "./tokenService";

// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (token: string) => void;
//   reject: (err: any) => void;
// }> = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token as string);
//   });
//   failedQueue = [];
// };

// const axiosInstance = axios.create({
//   baseURL: API_ENDPOINT,
//   timeout: 10000,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // ---- separate client for refresh (no interceptors) ----
// // const refreshClient = axios.create({
// //   baseURL: API_ENDPOINT,
// //   timeout: 10000,
// //   withCredentials: true,
// //   headers: {
// //     "Content-Type": "application/json",
// //     Accept: "application/json",
// //   },
// // });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = tokenService.getToken();
//     if (accessToken) {
//       // ensure headers exist
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (err: AxiosError) => {
//     console.error("axios error response interceptor ", err?.response?.status ?? err?.code);

//     const status = err?.response?.status;

//     if (status === 461) {
//       // IMPORTANT: return the refreshToken promise so axios waits for retry
//       return refreshToken(err);
//     } else if (status === 462) {
//       // refresh invalid -> force login
//       window.location.href = "/login";
//       return Promise.reject(err);
//     } else if (status === 500) {
//       console.error("Server error. Please try again later.");
//     } else if (err.code === "ECONNABORTED") {
//       console.error("Request timeout. Please try again.");
//     }

//     return Promise.reject(err);
//   }
// );

// export default axiosInstance;

// const refreshToken = async (err: any) => {
//   const originalReq = err.config;
//   if (!originalReq) {
//     return Promise.reject(err);
//   }

//   // Avoid multiple refresh attempts for the same request
//   if (originalReq._retry) {
//     // already retried once - reject
//     return Promise.reject(err);
//   }

//   if (isRefreshing) {
//     // queue the request and return a promise that will retry when token is ready
//     return new Promise((resolve, reject) => {
//       failedQueue.push({
//         resolve: (token: string) => {
//           // set the header on this original request before retrying
//           originalReq.headers = originalReq.headers || {};
//           originalReq.headers.Authorization = "Bearer " + token;
//           resolve(axiosInstance(originalReq));
//         },
//         reject: (error) => {
//           reject(error);
//         },
//       });
//     });
//   }

//   originalReq._retry = true;
//   isRefreshing = true;

//   try {
//     // Use refreshClient so this request won't trigger the same interceptors
//     const res = await axiosInstance.post("/api/auth/refresh", {}, { withCredentials: true });

//     // If refresh endpoint signals invalid refresh, redirect to login
//     if (res.status === 462 || (res.data && res.data.message && /(invalid refresh token|there is no refresh token)/i.test(res.data.message))) {
//       window.location.href = "/login";
//       throw new Error("Invalid refresh token");
//     }

//     const newToken = res.data.accessToken;
//     if (!newToken) {
//       throw new Error("No access token returned by refresh endpoint");
//     }

//     // update default header for the axios instance (future requests)
//     axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + newToken;

//     // make sure the original request uses the new token
//     originalReq.headers = originalReq.headers || {};
//     originalReq.headers.Authorization = "Bearer " + newToken;

//     // resolve queued requests (they will set headers and then retry)
//     processQueue(null, newToken);

//     // persist token in your token service
//     tokenService.setToken(newToken);

//     // retry the original request
//     return axiosInstance(originalReq);
//   } catch (refreshError:any) {
//     processQueue(refreshError, null);
//     // optional: redirect to login on refresh failure
//     try {
//       const status = refreshError?.response?.status;
//       if (status === 462) {
//         window.location.href = "/login";
//       }
//     } catch (e) {
//       // ignore
//     }
//     return Promise.reject(refreshError);
//   } finally {
//     isRefreshing = false;
//   }
// };

