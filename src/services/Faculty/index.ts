"use server";

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TFaculty } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const createFacultyReq = async (payload: FieldValues) => {
  try {
    const res = await axiosInstance.post("/users/create-faculty", payload);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getAllFacultiesReq = async ():Promise<{
  status: string;
  message: string;
  data: {data:TFaculty[],totalPages:number} | undefined;
}> => {
  try {
    const res = await axiosInstance.get("/faculties");
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
