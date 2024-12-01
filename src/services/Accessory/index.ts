"use server"

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { FieldValues } from "react-hook-form";

export const createAccessoryReq = async (payload: FieldValues) => {
    try {
      const res = await axiosInstance.post("/accessories/create-accessory", payload);
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };