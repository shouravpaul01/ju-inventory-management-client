"use server"

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TCurrentUser, TResetDetails } from "@/src/types";
import { jwtDecode } from "jwt-decode";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FieldValues } from "react-hook-form";

export const loginReq=async(payload:FieldValues)=>{
    try {
        const {data} = await axiosInstance.post("/auth/login", payload);
        
        if (data?.success) {
            cookies().set("accessToken",data?.data?.accessToken)
        }
        return data;
      } catch (error: any) {
        return error?.response?.data;
      }
}
export const getCurrentuser = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  let decodedResult: Partial<TCurrentUser> = {};
  if (accessToken) {
    const decoded: TCurrentUser = await jwtDecode(accessToken);
    decodedResult = decoded;
  }
  return decodedResult;
};
export const logoutUser = async () => {
  return cookies().delete("accessToken");
};
export const changePasswordReq = async (bodyData: FieldValues) => {
  try {
    const { data } = await axiosInstance.patch(
      "/auth/change-password",
      bodyData
    );

    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const sendOTPReq = async (email: string) => {
  try {
    const { data } = await axiosInstance.patch(`/auth/send-otp?email=${email}`);
    if (data?.success) {
      cookies().set("resetPasswordToken", data?.data?.resetPasswordToken);
    }

    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getResetDetails = async () => {
  const resetPasswordToken = cookies().get("resetPasswordToken")?.value;
  let decodedResult: Partial<TResetDetails> = {};
  if (resetPasswordToken) {
    const decoded: TResetDetails = await jwtDecode(resetPasswordToken);
    decodedResult = decoded;
  }
  return decodedResult;
};
export const matchedOTPReq = async (bodyData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(`/auth/matched-otp`, bodyData);
    if (data?.status) {
      cookies().set("resetPasswordToken", data?.data?.resetPasswordToken);
    }

    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const resetPasswordReq = async (bodyData: FieldValues) => {
  try {
    const { data } = await axiosInstance.patch(
      `/auth/reset-password`,
      bodyData
    );
    if (data?.status) {
      cookies().delete("resetPasswordToken");
    }

    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const deleteOTPReq = async () => {
  try {
    const resetDetails=await getResetDetails()
    const { data } = await axiosInstance.patch(`/auth/delete-otp?email=${resetDetails.email}`);
   


    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const cencelResetPasswordProcces = async () => {
  cookies().delete("resetPasswordToken");
  redirect("/login");
};
