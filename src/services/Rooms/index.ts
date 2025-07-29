"use server"

import axiosInstance from "@/src/lib/AxiosInstence";
import { TQuery, TRoom } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const createRoomReq = async (payload: FieldValues) => {
    try {
      const res = await axiosInstance.post("/rooms/create-room", payload);
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };

  export const getAllRoomsReq = async ({
    query,
  }: {
    query: TQuery[];
  }): Promise<{
    success: string;
    message: string;
    data: { data: TRoom[]; totalPages: number } | undefined;
  }> => {
    const params = new URLSearchParams();
    if (Array.isArray(query) && query?.length > 0) {
      query?.forEach((item) => params.append(item.name, item.value));
    }
    try {
      const res = await axiosInstance.get(`/rooms`, { params });
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
//   export const getSingleAccessoryReq = async (
//     accessoryId: string
//   ): Promise<{
//     success: string;
//     message: string;
//     data: TAccessory;
//     errorMessages?: TErrorMessage[];
//   }> => {
//     try {
//       const res = await axiosInstance.get(
//         `/accessories/single-accessory/${accessoryId}`
//       );
//       return res.data;
//     } catch (error: any) {
//       return error?.response?.data;
//     }
//   };
//   export const updateAccessoryReq = async (payload: FieldValues) => {
//     try {
//       const res = await axiosInstance.patch(
//         `/accessories/update-accessory/${payload.accessoryId}`,payload.data
//       );
//       return res.data;
//     } catch (error: any) {
//       return error?.response?.data;
//     }
//   };