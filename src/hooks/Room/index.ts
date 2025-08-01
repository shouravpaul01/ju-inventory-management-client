import { getAllRoomsReq, getSingleRoomReq } from "@/src/services/Rooms";
import { TQuery } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

export const getAllRooms = ({ query }: { query: TQuery[] }) => {
  return useQuery({
    queryKey: ["rooms", query],
    queryFn: async () => {
      const res = await getAllRoomsReq({ query });
      return res?.data;
    },
  });
};

export const getSingleRoomDetails = (roomId: string) => {
  return useQuery({
    queryKey: ["single-room", roomId],
    queryFn: async () => {
      const res = await getSingleRoomReq(roomId!);
      return res?.data;
    },
    enabled: !!roomId,
  });
};