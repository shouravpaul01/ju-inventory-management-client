"use server";

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { FieldValues } from "react-hook-form";

export const createFacultyReq = async (payload: FieldValues) => {
  try {
    const res = await axiosInstance.post("/faculty/create-faculty", payload);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
