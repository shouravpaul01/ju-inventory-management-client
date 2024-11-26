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
      .nonempty("Password is required.")
      .min(6, { message: "Password must be at least 6 characters." })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character.",
      }),

    confirmPassword: z.string().nonempty("Confirm Password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
