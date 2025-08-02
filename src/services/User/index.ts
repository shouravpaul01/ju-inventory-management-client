"use server";

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TErrorMessage, TQuery, TUser } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const getAllUsersReq = async ({
  query,
}: {
  query: TQuery[];
}): Promise<{
  success: string;
  message: string;
  data: { data: TUser[]; totalPages: number } | undefined;
}> => {
  const params = new URLSearchParams();
  if (Array.isArray(query) && query?.length > 0) {
    query?.forEach((item) => params.append(item.name, item.value));
  }
  try {
    const res = await axiosInstance.get(`/users`, { params });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getSingleUserReq = async (
  userIdOrEmail: string
): Promise<{
  success: string;
  message: string;
  data: TUser;
  errorMessages?: TErrorMessage[];
}> => {
  try {
    const res = await axiosInstance.get(`/users/single-user/${userIdOrEmail}`);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const updateUserReq = async (payload: FieldValues) => {
  try {
    const res = await axiosInstance.patch(
      `/users/update-user/${payload.userId}`,
      payload.data
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const updateUserApprovedStatus = async (userId: string) => {
  try {
    const res = await axiosInstance.patch(
      `/users/update-approved-status/${userId}`
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const updateBlockedStatusReq = async (
  userId: string,
  isBlocked: boolean
) => {
  try {
    const res = await axiosInstance.patch(
      `/users/update-blocked-status/${userId}?isBlocked=${isBlocked}`
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const updateUserRoleReq = async (userId: string, role: string) => {
  try {
    const res = await axiosInstance.patch(
      `/users/update-role/${userId}?role=${role}`
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const deleteUserReq = async (userId: string) => {
  try {
    const res = await axiosInstance.delete(`/users/delete-user/${userId}`);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const restoreUserReq = async (userId: string) => {
  try {
    const res = await axiosInstance.patch(`/users/restore-user/${userId}`);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
