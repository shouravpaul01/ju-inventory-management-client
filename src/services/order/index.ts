"use server";
import axiosInstance from "@/src/lib/AxiosInstence";
import { FieldValues } from "react-hook-form";

export const createOrderReq = async (payload: FieldValues) => {
    console.log(payload,"pay")
  try {
    const res = await axiosInstance.post(
      "/orders/create-order",
      payload
    );
    console.log(res,"resu")
    return res.data;
  } catch (error: any) {
    console.log(error,"error")
    return error?.response?.data;
  }
};