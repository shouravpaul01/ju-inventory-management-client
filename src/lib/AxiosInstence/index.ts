'use server'
import envConfig from "@/src/config/envConfig";
import axios from "axios";
import { cookies } from "next/headers";


export const axiosInstance = axios.create({
    baseURL: envConfig.baseApi,
   
  });
  axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent


    const accessToken=cookies().get("accessToken")?.value
    if (accessToken) {
      config.headers.Authorization=`Bearer ${accessToken}`
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  export default axiosInstance