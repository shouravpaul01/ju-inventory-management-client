import { z } from "zod";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const accessoryValidation = z.object({
  category: z.string().nonempty("Category is required."),
  subCategory: z.string().nonempty("Sub Category is required."),
  image: z
  .union([
    z.null(),
    z
      .array(z.instanceof(File))
      .nonempty("Images are required.")
      .min(1, "At least one file is required")
      .max(3, "Maximum 3 files allowed")
      .refine(
        (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
        "Each file must be less than 2MB"
      )
      .refine(
        (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        "Only .jpg, .jpeg, .png formats are supported"
      ),
  ])
  .refine((val) => val !== null, {
    message: "Image is required.",
  }),

  isItReturnable: z.string().nonempty("Returnable is required."),
    
  name: z.string().nonempty("Name is required."),
  codeTitle:z.string().optional(),
  description: z.string().optional(),
})
export const updateStockQuantityValidation = z.object({
  _id: z.string().nonempty("Category is required."),
  quantity: z
    .number({
      required_error: "Quantity is required.",
      invalid_type_error: "Quantity is required.",
    })
    .positive("Quantity must be a positive number."),
});
