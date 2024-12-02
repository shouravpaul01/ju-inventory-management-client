"use server";
import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TCategory, TErrorMessage, TQuery } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const createCategoryReq = async (payload: FieldValues) => {
  try {
    const res = await axiosInstance.post(
      "/categories/create-category",
      payload
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getAllCategoriesReq = async ({
  query,
}: {
  query: TQuery[];
}): Promise<{
  success: string;
  message: string;
  data: { data: TCategory[]; totalPages: number } | undefined;
}> => {
  const params = new URLSearchParams();
  if (Array.isArray(query) && query?.length > 0) {
    query?.forEach((item) => params.append(item.name, item.value));
  }
  try {
    const res = await axiosInstance.get(`/categories`, { params });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getSingleCategotyReq = async (
  categoryId: string
): Promise<{
  success: string;
  message: string;
  data: TCategory;
  errorMessages?: TErrorMessage[];
}> => {
  try {
    const res = await axiosInstance.get(
      `/categories/single-category/${categoryId}`
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const updateCategoryReq = async (
  categoryId: string,
  payload: FieldValues
) => {
  try {
    const res = await axiosInstance.patch(
      `/categories/update-category/${categoryId}`,
      payload
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const updateCategoryActiveStatus = async (
  categoryId: string,
  isActive: boolean
) => {
  try {
    const res = await axiosInstance.patch(
      `/categories/update-active-status/${categoryId}?isActive=${isActive}`
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const updateCategoryApprovedStatus = async (categoryId: string) => {
  try {
    const res = await axiosInstance.patch(
      `/categories/update-approved-status/${categoryId}`
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
