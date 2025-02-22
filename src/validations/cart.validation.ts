import dayjs from "dayjs";
import { z } from "zod";

const cartItemSchema = z
  .object({
    accessory:z.string(),
    expectedQuantity: z.number().min(1, "Minimum order qunatity 1.").max(5,"Maximum order quantity 5."),
   
  
  })


export const cartItemSchemaValidation = z.object({
  items: z.array(cartItemSchema),
});