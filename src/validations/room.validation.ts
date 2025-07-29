import { z } from "zod";

export const roomSchemaValidation = z
  .object({
    roomNo: z
      .string()
      .nonempty("Room number is required")
      .max(5, "Room number must be at most 5 characters")
      .regex(/\d/, "Room number must include at least one number"),

    department: z.string().nonempty("Department is required"),

    building: z.string().nonempty("Building is required"),

    floor: z
      .string()
      .nonempty("Floor is required")
      .max(3, "Floor must be at most 3 characters"),

    roomType: z.string().nonempty("Room type is required"),

    capacity: z
      .number({ invalid_type_error: "Capacity must be a number" })
      .int("Capacity must be an integer")
      .positive("Capacity must be positive")
      .optional(),

    images: z.any().optional(),

    description: z.string().optional(),

    features: z.preprocess((val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean); // remove empty strings
      }
      return val;
    }, z.array(z.string().nonempty("Feature cannot be empty")).nonempty("At least one feature is required")),
  })
  .superRefine((data, ctx) => {
    const requiredTypes = ["Classroom", "Lecture Hall", "Conference"];
    if (requiredTypes.includes(data.roomType) && (data.capacity === undefined || data.capacity === null)) {
      ctx.addIssue({
        path: ["capacity"],
        code: z.ZodIssueCode.custom,
        message: "Capacity is required for this room type",
      });
    }
  });
