"use server"

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TAccessory, TErrorMessage, TQuery } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const createAccessoryReq = async (payload: FieldValues) => {
    try {
      const res = await axiosInstance.post("/accessories/create-accessory", payload);
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };

  export const getAllAccessoriesReq = async ({
    query,
  }: {
    query: TQuery[];
  }): Promise<{
    success: string;
    message: string;
    data: { data: TAccessory[]; totalPages: number } | undefined;
  }> => {
    const params = new URLSearchParams();
    if (Array.isArray(query) && query?.length > 0) {
      query?.forEach((item) => params.append(item.name, item.value));
    }
    try {
      const res = await axiosInstance.get(`/accessories`, { params });
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const getSingleAccessoryReq = async (
    accessoryId: string
  ): Promise<{
    success: string;
    message: string;
    data: TAccessory;
    errorMessages?: TErrorMessage[];
  }> => {
    try {
      const res = await axiosInstance.get(
        `/accessories/single-accessory/${accessoryId}`
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateAccessoryReq = async (payload: FieldValues) => {
    try {
      const res = await axiosInstance.patch(
        `/accessories/update-accessory/${payload.accessoryId}`,payload.data
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateStockQuantity = async (payload: FieldValues) => {
    try {
      const res = await axiosInstance.patch(`/accessories/update-quantity/${payload._id}`, {quantity:payload.quantity});
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateAccessoryActiveStatus = async (
    accessoryId: string,
    isActive: boolean
  ) => {
    try {
      const res = await axiosInstance.patch(
        `/accessories/update-active-status/${accessoryId}?isActive=${isActive}`
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateAccessoryApprovedStatus = async (accessoryId: string) => {
    try {
      const res = await axiosInstance.patch(
        `/accessories/update-approved-status/${accessoryId}`
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  