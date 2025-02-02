import { getAllOrdersReq, getSingleOrderReq } from "@/src/services/order";
import { TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllOrders = ({ query }: { query: TQuery[] }) => {
    return useQuery({
      queryKey: ["orders", query],
      queryFn: async () => {
        const res = await getAllOrdersReq({ query });
        return res?.data;
      },
    });
  };
  export const getSingleOrder = (orderId:string) => {
    return useQuery({
      queryKey: ["single-order", orderId],
      queryFn: async () => {
        const res = await getSingleOrderReq(orderId);
        return res?.data;
      },
      enabled:!!orderId
    });
  };