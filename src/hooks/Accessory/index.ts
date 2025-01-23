"use client"
import { getAllAccessoriesReq, getSingleAccessoryReq } from "@/src/services/Accessory";
import { TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllAccessories = ({ query }: { query: TQuery[] }) => {
    return useQuery({
      queryKey: ["accessories", query],
      queryFn: async () => {
        const res = await getAllAccessoriesReq({ query });
        return res?.data;
      },
      
    });
  };
  export const getSingleAccessory = (accessoryId: string) => {
    return useQuery({
      queryKey: ["single-accessory", accessoryId],
      queryFn: async () => {
        const res = await getSingleAccessoryReq(accessoryId!);
        return res?.data;
      },
      enabled: !!accessoryId,
      staleTime: 0,
    });
  };