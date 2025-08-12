import { z } from "zod";

export const updateStockQuantityValidation = z.object({
  quantity: z.number({
    required_error: "Quantity is required.",
    invalid_type_error: "Quantity is required.",
  }).positive("Quantity must be a positive number."),
  documentImages: z.any().optional(),
  locatedImages: z.any().optional(),
  locatedDetails: z
    .object({
      roomNo: z.string().min(1, "Room number is required"),
      place: z.string().min(1, "Place is required"),
     
    })
    .optional(),
  description: z.string().optional(),
});