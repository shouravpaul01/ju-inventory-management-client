'use client'
import { getCurrentuser } from "@/src/services/Auth";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: ["current-user"],
      queryFn: async () => {
        const res = await getCurrentuser();
        return res;
      },
      staleTime: 0,
    });
}