"use server";
import axiosInstance from "@/src/lib/AxiosInstence";
import { TErrorMessage, TQuery, TStock, TStockDetail } from "@/src/types";
import { FieldValues } from "react-hook-form";

export const createStock=async(payload:FieldValues)=>{
  try {
    const res = await axiosInstance.post(`/stocks/create-stock/${payload.stockId}`,payload.data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
}
export const getAllStocksReq = async ({
    query,
  }: {
    query: TQuery[];
  }): Promise<{
    success: string;
    message: string;
    data:  TStock | undefined;
  }> => {
    const params = new URLSearchParams();
    if (Array.isArray(query) && query?.length > 0) {
      query?.forEach((item) => params.append(item.name, item.value));
    }
    try {
      const res = await axiosInstance.get(`/stocks`, { params });
      console.log(res,"req")
      return res.data || [];
    } catch (error: any) {
      return error?.response?.data;
    }
  };
  export const updateStockApprovedStatus = async (stockId: string,stockDetailsId: string) => {
      try {
        const res = await axiosInstance.patch(
          `/stocks/update-approved-status?stockId=${stockId}&stockDetailsId=${stockDetailsId}`
        );
        return res.data;
      } catch (error: any) {
        return error?.response?.data;
      }
    };
    export const getSingleStockReq = async (
      stockId: string,stockDetailsId: string
    ): Promise<{
      success: string;
      message: string;
      data: TStockDetail;
      errorMessages?: TErrorMessage[];
    }> => {
      try {
        const res = await axiosInstance.get(
          `/stocks/single-stock?stockId=${stockId}&stockDetailsId=${stockDetailsId}`
        );
        return res.data;
      } catch (error: any) {
        return error?.response?.data;
      }
    };
    export const updateStockReq = async (
      payload:FieldValues
    ) => {
      try {
        const res = await axiosInstance.patch(
          `/stocks/update-stock?stockId=${payload.stockId}&stockDetailsId=${payload.stockDetailsId}`,
          payload.data
        );
        return res.data;
      } catch (error: any) {
        return error?.response?.data;
      }
    };