"use server";
import axiosInstance from "@/src/lib/AxiosInstence";
import { TOrder, TQuery } from "@/src/types";
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
export const getAllOrdersReq = async ({
  query,
}: {
  query: TQuery[];
}): Promise<{
  success: string;
  message: string;
  data: { data: TOrder[]; totalPages: number } | undefined;
}> => {
  const params = new URLSearchParams();
  if (Array.isArray(query) && query?.length > 0) {
    query?.forEach((item) => params.append(item.name, item.value));
  }
  try {
    const res = await axiosInstance.get(`/orders`, { params });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};