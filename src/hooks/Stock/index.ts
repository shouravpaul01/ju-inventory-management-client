import { getAllStocksReq } from "@/src/services/Stock";
import { TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllStocks = ({ query }: { query: TQuery[] }) => {
    return useQuery({
      queryKey: ["stocks", query],
      queryFn: async () => {
        const res = await getAllStocksReq({ query });
        return res?.data;
      },
    });
  };