"use server";

import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TCurrentUser, TResetDetails } from "@/src/types";
import { jwtDecode } from "jwt-decode";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FieldValues } from "react-hook-form";

export const loginReq = async (payload: FieldValues) => {
  try {
    const cookieStore = await cookies()
    const { data } = await axiosInstance.post("/auth/login", payload);

    if (data?.success) {
   cookieStore.set("accessToken", data?.data?.accessToken);
    }
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getCurrentuser = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value;
  let decodedResult: Partial<TCurrentUser> = {};
  if (accessToken) {
    const decoded: TCurrentUser = await jwtDecode(accessToken);
    decodedResult = decoded;
  }
  return decodedResult;
};
export const logoutUser = async () => {
  const cookieStore = await cookies()
  return cookieStore.delete("accessToken");
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
    const cookieStore = await cookies()
    const { data } = await axiosInstance.patch(`/auth/send-otp?email=${email}`);
    if (data?.success) {
      cookieStore.set("verificationToken", data?.data?.verificationToken);
    }

    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getVerificationTokenToken = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("verificationToken")?.value;

  return { token };
};
export const getVerificationTokenDecodeData = async () => {
  const cookieStore = await cookies()
  const verificationToken = cookieStore.get("verificationToken")?.value;
  let decodedResult: Partial<TResetDetails> = {};
  if (verificationToken) {
    const decoded: TResetDetails = await jwtDecode(verificationToken);
    decodedResult = decoded;
  }
  return decodedResult;
};

export const matchedOTPReq = async (bodyData: FieldValues) => {
  try {
    const cookieStore = await cookies()
    const { data } = await axiosInstance.post(`/auth/matched-otp`, bodyData);
    if (data?.success) {
       cookieStore.delete("verificationToken");
       cookieStore.set("resetPasswordToken", data?.data?.resetPasswordToken);
    }

    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getResetPasswordToken = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("resetPasswordToken")?.value;

  return { token };
};
export const resetPasswordReq = async (bodyData: FieldValues) => {
  try {
    const cookieStore = await cookies()
    const { data } = await axiosInstance.patch(
      `/auth/reset-password`,
      bodyData
    );
    if (data?.success) {
      cookieStore.delete("resetPasswordToken");
    }

    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const deleteOTPReq = async (email:string) => {
  try {
    const { data } = await axiosInstance.patch(
      `/auth/delete-otp?email=${email}`
    );

    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const cencelVerificationProcces =  async() => {
  const cookieStore = await cookies()
   cookieStore.delete("verificationToken");
  redirect("/login");
};
