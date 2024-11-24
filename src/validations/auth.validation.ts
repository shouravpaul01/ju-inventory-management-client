
import { z } from "zod";

export const loginValidation=z.object({
    userId:z.string().nonempty("User ID is required.").toUpperCase(),
    password:z.string().nonempty("Password is required.")
})
export const findAccountValidation=z.object({
    userIdorEmail:z.string().nonempty("The field is required.")
})
export const otpValidation = z.object({
    otp: z
      .string()
      .nonempty("OTP is required.")
      .min(6, { message: "OTP must be 6-Digits." }),
  });