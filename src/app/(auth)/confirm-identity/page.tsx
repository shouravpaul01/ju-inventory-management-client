"use client";

import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import { TimerIcon } from "@/src/components/icons";
import { useUser } from "@/src/context/user.provider";
import { useCountdownOTPTimeout } from "@/src/hooks";
import { cencelResetPasswordProcces, getResetDetails, sendOTPReq } from "@/src/services/Auth";
import { getOTPTimeout } from "@/src/utils/getOTPTimeout";
import { otpValidation } from "@/src/validations/auth.validation";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";

import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function ConfirmIdentityPage() {
  const router = useRouter();
  const {resetPasswordDetails,user:currentUser}=useUser()
  const [error, setError] = useState<string>();
const {formattedTime,timeLeft,isLoading,setIsResendSuccess,reset} =useCountdownOTPTimeout()
   // Resend availability
  console.log(formattedTime,"ss")
  // Format time in mm:ss format

  const handleConfirmIdentity: SubmitHandler<FieldValues> = async (data) => {
    //   const resetDetails = await getResetDetails();
    //   const res = await matchedOTPReq({
    //     email: resetDetails.email,
    //     otp: data.otp,
    //   });
    //   if (res.status && res?.data) {
    //     router.push("/confirm-identity?tab=reset_password");
    //   }
    //   if (!res?.status && res?.errorMessages) {
    //     setError(res?.errorMessages[0]?.message);
    //   }
  };
  const handleSendOTP = async () => {
      const resetDetails = await getResetDetails();
      const res = await sendOTPReq(resetDetails.email!);
      if (res?.success && res?.data) {
        setIsResendSuccess(true)
        reset()
        toast.success(res?.message);
        setError('')
      }
      if (!res?.status && res?.errorMessages) {
        setError(res?.errorMessages[0]?.message);
      }
  };
  const handleResetPassword: SubmitHandler<FieldValues> = async (data) => {
    //   const resetDetails = await getResetDetails();
    //   if (resetDetails) {
    //       router.push("/confirm-identity");
    //   }
    //   const res = await resetPasswordReq({
    //     email: resetDetails.email!,
    //     otp: resetDetails.otp,
    //     password: data.password,
    //   });
    //   if (res?.status && res?.data) {
    //     router.push("/login");
    //     toast.success(res?.message);
    //   }
    //   if (!res?.status && res?.errorMessages) {
    //     setError(res?.errorMessages[0]?.message);
    //   }
  };
  return (
    <div className="shadow-small w-full md:max-w-md rounded-md p-5">
      <JUForm onSubmit={handleConfirmIdentity} resolver={otpValidation}>
        <p className="font-bold text-xl">Verify Identity</p>
        <p className="font-semibold text-gray-400">
          Please check your emails for a message with your code. Your code is 6
          numbers long.
        </p>
        {error && (
          <Chip
            color="danger"
            variant="flat"
            classNames={{
           
              closeButton: " ms-5",
            }}
            onClose={() => setError("")}
          >
            {error}
          </Chip>
        )}

        <div className="flex gap-2 my-3">
          <div>
            <JUInput
              name="otp"
              inputProps={{
                variant: "bordered",

                placeholder: "6-Digits OTP ",
                width: "max-w-xl",
                size: "md",
                isDisabled:timeLeft!<=0
              }}
            />
            <Link
              underline="hover"
              className="ms-2"
              onPress={() => handleSendOTP()}
            >
              OTP Send Again
            </Link>
          </div>
          <Chip radius="full" size="lg" variant="bordered" color={!isLoading && timeLeft!<60 ?"danger":"primary"} classNames={{base:"h-10" ,}} startContent={<TimerIcon className={`${!isLoading && timeLeft!<60 && "fill-danger"}`} />}>{formattedTime}</Chip> 
          
         
          
        </div>

        <div className="flex justify-end gap-3 ">
          <Button
            variant="faded"
            color="secondary"
            onPress={() => cencelResetPasswordProcces()}
          >
            Cencel
          </Button>
          <Button type="submit" color="secondary" size="md">
            Submit
          </Button>
        </div>
      </JUForm>
    </div>
  );
}
