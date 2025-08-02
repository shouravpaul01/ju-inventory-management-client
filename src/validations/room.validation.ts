import { features } from "process";
import { z } from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const roomSchemaValidation = z
  .object({
    roomNo: z
      .string({ required_error: "Room number is required" })
      .nonempty("Room number is required")
      .min(
        4,
        "Room number must be at least 4 characters (3 digits + 1-3 letters)"
      )
      .max(
        6,
        "Room number must be at most 6 characters (3 digits + 1-3 letters)"
      )
      .toUpperCase()
      .regex(
        /^\d{3}[A-Z]{1,3}$/,
        "Room number must be 3 digits followed by 1 to 3 uppercase letters (e.g., 222W, 302DD, 501AEE)"
      ),

    department: z
      .string({ required_error: "Department number is required" })
      .nonempty("Department number is required"),

    building: z
      .string({ required_error: "Building is required" })
      .nonempty("Building is required."),

    floor: z
      .string({ required_error: "Floor number is required" })
      .min(2, "Floor must be at least 2 characters (digit(s) + letter(s))")
      .max(4, "Floor must be at most 4 characters (digit(s) + letter(s))")
      .toUpperCase()
      .regex(
        /^\d{1,2}[A-Z]{1,2}$/,
        "Floor must be 1-2 digits followed by 1-2 uppercase letters (e.g., 2A, 10BB)"
      ),

    roomType: z
      .string({ required_error: "Room type is required" })
      .nonempty("Room type is required"),

    capacity: z
      .number({
        invalid_type_error: "Capacity must be a number",
        required_error: "Capacity is required.",
      })
      .int("Capacity must be an integer")
      .positive("Capacity must be positive"),

    // images: z
    //   .array(z.instanceof(File),{required_error:"Images is required."})
    //   .nonempty("Images is required.")
    //   .min(1, "At least one file is required")
    //   .max(3, "Maximum 3 files allowed")
    //   .refine(
    //     (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
    //     "Each file must be less than 5MB"
    //   ).refine(
    //     (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
    //     "Only .jpg, .jpeg, .png  formats are supported"
    //   ),

    // description: z.string().optional(),

    features: z
      .union([
        z
          .string({ required_error: "Features is required." })
          .nonempty("Features is required."),
        z.array(
          z
            .string({ required_error: "Features is required." })
            .nonempty("Features is required.")
        ),
      ])
      .transform((val) =>
        typeof val === "string"
          ? val
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item !== "")
          : val
      )
      .refine((arr) => arr.length > 0, {
        message: "At least one feature must be provided",
      }),
  })
  .superRefine((data, ctx) => {
    const requiredTypes = ["Classroom", "Lecture Hall", "Conference"];
    if (
      requiredTypes.includes(data.roomType) &&
      (data.capacity === undefined || data.capacity === null)
    ) {
      ctx.addIssue({
        path: ["capacity"],
        code: z.ZodIssueCode.custom,
        message: "Capacity is required for this room type",
      });
    }
  });
