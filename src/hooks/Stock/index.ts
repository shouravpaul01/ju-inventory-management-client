import { getAllStocksReq, getSingleStockReq } from "@/src/services/Stock";
import { TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllStocks = ({ query }: { query: TQuery[] }) => {
    return useQuery({
      queryKey: ["stocks", query],
      queryFn: async () => {
        const res = await getAllStocksReq({ query });
        return res?.data ;
      },
      enabled:!!(query.length>0)
    });
  };
  export const getSingleStock = (stockId: string,stockDetailsId: string) => {
    return useQuery({
      queryKey: ["single-stock", stockId,stockDetailsId],
      queryFn: async () => {
        const res = await getSingleStockReq(stockId,stockDetailsId);
        return res?.data;
      },
      enabled: !!stockDetailsId,
    });
  };