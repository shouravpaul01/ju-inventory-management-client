"use client";


import { getAllUsersReq, getSingleUserReq } from "@/src/services/User";
import { TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllUsers = ({ query }: { query: TQuery[] }) => {
  return useQuery({
    queryKey: ["users",query],
    queryFn: async () => {
      const res = await getAllUsersReq({ query });
      return res?.data;
    },
  });
};
export const getSingleUser = (userId:string) => {
  return useQuery({
    queryKey: ["single-user",userId],
    queryFn: async () => {
      const res = await getSingleUserReq(userId!);
      return res?.data;
    },
    enabled:!!userId,
    refetchOnWindowFocus:"always"
    
  });
};
