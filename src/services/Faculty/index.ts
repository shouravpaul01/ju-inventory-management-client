"use server";

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TFaculty, TQuery } from "@/src/types";
import { it } from "node:test";
import { FieldValues } from "react-hook-form";

export const createFacultyReq = async (payload: FieldValues) => {
  try {
    const res = await axiosInstance.post("/users/create-faculty", payload);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};


