
import {
  getAllCategoriesReq,
  getCategoriesWithSubCategoriesReq,
  getSingleCategotyReq,
} from "@/src/services/Category";
import {  TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllCategories = ({ query }: { query: TQuery[] }) => {
  return useQuery({
    queryKey: ["categories", query],
    queryFn: async () => {
      const res = await getAllCategoriesReq({ query });
      return res?.data;
    },
  });
};

export const getSingleCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["single-category", categoryId],
    queryFn: async () => {
      const res = await getSingleCategotyReq(categoryId!);
      return res?.data;
    },
    enabled: !!categoryId,
  });
};
export const getCategoriesWithSubCategories = () => {
  return useQuery({
    queryKey: ["categories-with-subCategories"],
    queryFn: async () => {
      const res = await getCategoriesWithSubCategoriesReq();
      return res?.data;
    },
  });
};