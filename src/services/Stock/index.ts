"use server";
import axiosInstance from "@/src/lib/AxiosInstence";
import { TQuery, TStock } from "@/src/types";

export const getAllStocksReq = async ({
    query,
  }: {
    query: TQuery[];
  }): Promise<{
    success: string;
    message: string;
    data: { data: TStock[]; totalPages: number } | undefined;
  }> => {
    const params = new URLSearchParams();
    if (Array.isArray(query) && query?.length > 0) {
      query?.forEach((item) => params.append(item.name, item.value));
    }
    try {
      const res = await axiosInstance.get(`/stocks`, { params });
      console.log(res,"req")
      return res.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  };