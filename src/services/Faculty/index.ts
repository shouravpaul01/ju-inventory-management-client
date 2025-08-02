"use server";

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TFaculty, TQuery } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const createFacultyReq = async (payload: FieldValues) => {
  try {
    const res = await axiosInstance.post("/users/create-faculty", payload);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getAllFacultiesReq = async ({
  query,
}: {
  query: TQuery[];
}): Promise<{
  success: string;
  message: string;
  data: { data: TFaculty[]; totalPages: number } | undefined;
}> => {
  const params = new URLSearchParams();
  if (Array.isArray(query) && query?.length > 0) {
    query?.forEach((item) => params.append(item.name, item.value));
  }
  try {
    const res = await axiosInstance.get(`/faculties`, { params });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};