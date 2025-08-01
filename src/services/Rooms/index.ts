"use server"

import axiosInstance from "@/src/lib/AxiosInstence";
import { TErrorMessage, TQuery, TRoom } from "@/src/types";
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
  export const getSingleRoomReq = async (
    roomId: string
  ): Promise<{
    success: string;
    message: string;
    data: TRoom;
    errorMessages?: TErrorMessage[];
  }> => {
    try {
      const res = await axiosInstance.get(
        `/rooms/single-room/${roomId}`
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const deleteSingleImageFromDBReq = async (
    roomId: string,
    imageUrl:string
  ): Promise<{
    success: string;
    message: string;
    data: TRoom;
    errorMessages?: TErrorMessage[];
  }> => {
    try {
      const res = await axiosInstance.delete(
        `/rooms/delete-image/${roomId}?imageUrl=${imageUrl}`
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateRoomIntroReq = async (roomId:string,payload: FieldValues) => {
    try {
      const res = await axiosInstance.patch(
        `/rooms/update-room/${roomId}`,payload
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateRoomActiveStatus = async (
    roomId: string,
    isActive: boolean
  ) => {
    try {
      const res = await axiosInstance.patch(
        `/rooms/update-active-status/${roomId}?isActive=${isActive}`
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateRoomApprovedStatus = async (roomId: string) => {
    try {
      const res = await axiosInstance.patch(
        `/rooms/update-approved-status/${roomId}`
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };