"use client";

import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import { TimerIcon } from "@/src/components/icons";
import { useUser } from "@/src/context/user.provider";
import { useCountdownOTPTimeout } from "@/src/hooks";
import {
  cencelVerificationProcces,
  getVerificationTokenDecodeData,
  getVerificationTokenToken,
  matchedOTPReq,
  sendOTPReq,
} from "@/src/services/Auth";
import { getOTPTimeout } from "@/src/utils/getOTPTimeout";
import { otpValidation } from "@/src/validations/auth.validation";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";

import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function ConfirmIdentityPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const { formattedTime, timeLeft, isLoading, setIsResendSuccess, reset } =
    useCountdownOTPTimeout();
  // Resend availability
  console.log(formattedTime, "ss");
  // Format time in mm:ss format

  const handleVerifyIdentity: SubmitHandler<FieldValues> = async (data) => {
    const { token } = await getVerificationTokenToken();
    if (!token || timeLeft! <= 0) {
      setError("The OTP has expired. Please try again.");
      return;
    }

    const res = await matchedOTPReq({
      token,
      otp: data.otp,
    });

    if (res.success && res?.data) {
      toast.success(res?.message);

      router.push("/reset-password");
    }
    if (!res?.success && res?.errorMessages) {
      setError(res?.errorMessages[0]?.message);
    }
  };
  const handleSendOTP = async () => {
    const verificationToken = await getVerificationTokenDecodeData();
    const res = await sendOTPReq(verificationToken.email!);
    if (res?.success && res?.data) {
      setIsResendSuccess(true);
      reset();
      toast.success(res?.message);
      setError("");
    }
    if (!res?.success && res?.errorMessages) {
      setError(res?.errorMessages[0]?.message);
    }
  };

  return (
    <div className="shadow-small w-full md:max-w-md rounded-md p-5">
      <JUForm onSubmit={handleVerifyIdentity} validation={otpValidation}>
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
                isDisabled: timeLeft! <= 0,
                placeholder: "6-Digits OTP ",
                width: "max-w-xl",
                size: "md",
              }}
              registerOptions={{ valueAsNumber: true }}
            />
            <Link
              underline="hover"
              className="ms-2"
              onPress={() => handleSendOTP()}
            >
              OTP Send Again
            </Link>
          </div>
          <Chip
            radius="full"
            size="lg"
            variant="bordered"
            color={!isLoading && timeLeft! < 60 ? "danger" : "primary"}
            classNames={{ base: "h-10" }}
            startContent={
              <TimerIcon
                className={`${!isLoading && timeLeft! < 60 && "fill-danger"}`}
              />
            }
          >
            {formattedTime}
          </Chip>
        </div>

        <div className="flex justify-end gap-3 ">
          <Button
            variant="faded"
            color="secondary"
            onPress={() => cencelVerificationProcces()}
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
