import { z } from "zod";

export const facultyValidation = z.object({
  name: z.string().nonempty("Name is required."),
  email: z.string().nonempty("Name is required.").email("Enter a valid email address."),
  roomNo: z
    .number({ required_error: "Room no is required." })
    .positive("Room no must be a postive number."),
  designation: z.string().nonempty("Name is required."),
  department: z.string().nonempty("Name is required."),
});
