
import dayjs from "dayjs";
import { z } from "zod";

const orderedItemSchema = z
  .object({
    accessory: z.string().nonempty("Accessory ID is required"),
    isItReturnable: z.boolean({required_error:"The feild is required.",invalid_type_error:"Invalid Type."}),
    currentQuantity: z.number().min(0, "Current quantity must be non-negative"),
    expectedQuantity: z.number().min(1, "Expected quantity must be non-negative"),
    providedQuantity: z
      .number()
      .min(0, "Provided quantity must be non-negative"),
    providedAccessoryCodes: z
      .any()
      .optional()
      .transform((value) => {
        if (value && typeof value === "string") {
          return value.split(",").map((code) => code.trim());
        }
        return value;
      }),

    returnDeadline: z
      .any()
      .optional()
      .transform((value) =>
        value ? dayjs(value).format("MMM D, YYYY") : undefined
      ),
  })
  .superRefine((data, ctx) => {
    if (data.providedQuantity > data.expectedQuantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provided quantity cannot exceed expected quantity",
        path: ["providedQuantity"],
      });
    }
    if (data.providedQuantity >= data.currentQuantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provided quantity cannot exceed current quantity",
        path: ["providedQuantity"],
      });
    }
    if (data.isItReturnable) {
      if (
        !data.providedAccessoryCodes ||
        data.providedAccessoryCodes.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The field is required.",
          path: ["providedAccessoryCodes"],
        });
      }
      if (
        
        data.providedAccessoryCodes.length !== data.providedQuantity
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Select the code for the ${data.providedQuantity} items.`,
          path: ["providedAccessoryCodes"],
        });
      }
      
      if (!data.returnDeadline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Return Deadline is required.",
          path: ["returnDeadline"],
        });
      }
      if (data.returnDeadline && dayjs(data.returnDeadline).isBefore(dayjs())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Return Deadline cannot be in the past.",
          path: ["returnDeadline"],
        });
      }
    }
  });

 
export const orderedItemSchemaValidation = z.object({
  items: z.array(orderedItemSchema),
});
