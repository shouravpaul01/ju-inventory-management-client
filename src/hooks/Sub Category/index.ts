import { axiosInstance } from "@/src/lib/AxiosInstence";
import {
  getAllCategoriesReq,
  getSingleCategotyReq,
} from "@/src/services/Category";
import { getAllSubCategoriesReq, getSingleSubCategotyReq } from "@/src/services/Sub Category";
import { TCategory, TErrorMessage, TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllSubCategories = ({ query }: { query: TQuery[] }) => {
  return useQuery({
    queryKey: ["sub-categories", query],
    queryFn: async () => {
      const res = await getAllSubCategoriesReq({ query });
      return res?.data;
    },
  });
};

export const getSingleSubCategory = (subCategoryId: string) => {
  return useQuery({
    queryKey: ["single-subcategory", subCategoryId],
    queryFn: async () => {
      const res = await getSingleSubCategotyReq(subCategoryId!);
      return res?.data;
    },
    enabled: !!subCategoryId,
  });
};
