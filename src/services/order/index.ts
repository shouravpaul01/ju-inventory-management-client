"use server";
import axiosInstance from "@/src/lib/AxiosInstence";
import { TErrorMessage, TOrder, TQuery } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const createOrderReq = async (payload: FieldValues) => {
  console.log(payload, "pay");
  try {
    const res = await axiosInstance.post("/orders/create-order", payload);
    console.log(res, "resu");
    return res.data;
  } catch (error: any) {
    console.log(error, "error");
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
export const getSingleOrderReq = async (orderId: string):Promise<{
  success: string;
  message: string;
  data: TOrder;
  errorMessages?: TErrorMessage[];
}>=> {
  try {
    const res = await axiosInstance.get(
      `/orders/single-order/${orderId}`
    );

    return res.data;
  } catch (error: any) {
    console.log(error, "error");
    return error?.response?.data;
  }
};
export const updateEventStatusReq = async (orderId: string, event: string) => {
  try {
    const res = await axiosInstance.patch(
      `/orders/update-event/${orderId}?event=${event}`
    );

    return res.data;
  } catch (error: any) {
    console.log(error, "error");
    return error?.response?.data;
  }
};
export const updateOrderItemsReq = async (orderId: string,itemId:string, payload: FieldValues) => {
  try {
    const res = await axiosInstance.patch(
      `/orders/update-order-items/${orderId}/${itemId}`,payload
    );

    return res.data;
  } catch (error: any) {
    console.log(error, "error");
    return error?.response?.data;
  }
};
