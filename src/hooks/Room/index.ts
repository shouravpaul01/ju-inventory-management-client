import { getAllRoomsReq } from "@/src/services/Rooms";
import { TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllCategories = ({ query }: { query: TQuery[] }) => {
  return useQuery({
    queryKey: ["categories", query],
    queryFn: async () => {
      const res = await getAllRoomsReq({ query });
      return res?.data;
    },
  });
};

// export const getSingleCategory = (categoryId: string) => {
//   return useQuery({
//     queryKey: ["single-category", categoryId],
//     queryFn: async () => {
//       const res = await getSingleCategotyReq(categoryId!);
//       return res?.data;
//     },
//     enabled: !!categoryId,
//   });
// };