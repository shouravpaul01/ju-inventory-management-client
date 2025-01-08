import { z } from "zod";

export const updateStockQuantityValidation = z.object({
  quantity: z.number({
    required_error: "Quantity is required.",
    invalid_type_error: "Quantity is required.",
  }).positive("Quantity must be a positive number."),
  images: z.any().optional(),
  description: z.string().optional(),
});