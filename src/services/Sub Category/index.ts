"use server"
import { axiosInstance } from "@/src/lib/AxiosInstence";
import { TCategory, TErrorMessage, TQuery, TSubCategory } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const createSubCategoryReq = async (payload: FieldValues) => {
    try {
      const res = await axiosInstance.post("/sub-categories/create-sub-category", payload);
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const getAllSubCategoriesReq = async ({
    query,
  }: {
    query: TQuery[];
  }): Promise<{
    success: string;
    message: string;
    data: { data: TSubCategory[]; totalPages: number } | undefined;
  }> => {
    const params = new URLSearchParams();
    if (Array.isArray(query) && query?.length > 0) {
      query?.forEach((item) => params.append(item.name, item.value));
    }
    try {
      const res = await axiosInstance.get(`/sub-categories`, { params });
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const getSingleSubCategotyReq = async (
    subCategoryId: string
  ): Promise<{
    success: string;
    message: string;
    data: TSubCategory;
    errorMessages?: TErrorMessage[];
  }> => {
    try {
      const res = await axiosInstance.get(`/sub-categories/single-sub-category/${subCategoryId}`);
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateSubCategoryReq = async (subCategoryId:string,payload: FieldValues) => {
    try {
      const res = await axiosInstance.patch(
        `/sub-categories/update-sub-category/${subCategoryId}`,
        payload
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateSubCategoryActiveStatus = async (subCategoryId: string,isActive:boolean) => {
    try {
      const res = await axiosInstance.patch(
        `/sub-categories/update-active-status/${subCategoryId}?isActive=${isActive}`,
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateSubCategoryApprovedStatus = async (subCategoryId: string) => {
    try {
      const res = await axiosInstance.patch(
        `/sub-categories/update-approved-status/${subCategoryId}`,
      );
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };