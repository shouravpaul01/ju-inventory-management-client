"use client"

import { getAllFacultiesReq } from "@/src/services/Faculty"
import { useQuery } from "@tanstack/react-query"

export const getAllFaculties=()=>{
    return useQuery({
        queryKey: ['faculties'],
        queryFn: async () => {
          const res = await getAllFacultiesReq()
          return res?.data
        },
      })
}