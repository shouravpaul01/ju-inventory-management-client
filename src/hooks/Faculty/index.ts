import { getAllFacultiesReq } from "@/src/services/Faculty";
import { TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllFaculties = ({ query }: { query: TQuery[] }) => {
    return useQuery({
      queryKey: ["faculties", query],
      queryFn: async () => {
        const res = await getAllFacultiesReq({ query });
        return res?.data;
      },
    });
  };