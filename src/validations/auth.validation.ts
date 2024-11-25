import { z } from "zod";

export const loginValidation = z.object({
  userId: z.string().nonempty("User ID is required.").toUpperCase(),
  password: z.string().nonempty("Password is required."),
});
export const findAccountValidation = z.object({
  userIdorEmail: z.string().nonempty("The field is required."),
});
export const otpValidation = z.object({
  otp: z
    .number({
      required_error: "OTP is required.",
      invalid_type_error: "OTP is required.",
    })
    .min(100000, { message: "OTP must be 6-Digits." })
    .max(999999, { message: "OTP must be 6-Digits." }),
});
export const resetPasswordValidation = z
  .object({
    password: z
      .string()
      .nonempty("The field is required.")
      .min(6, { message: "Password must be six charecters." }),

    confirmPassword: z.string().nonempty("The field is required"),
  })
  .refine((data: any) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
