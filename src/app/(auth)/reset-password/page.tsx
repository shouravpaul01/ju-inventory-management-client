"use client";
import JUForm from "@/src/components/form/JUForm";
import JUPasswordInput from "@/src/components/form/JUPasswordInput";
import { getResetPasswordToken, resetPasswordReq } from "@/src/services/Auth";
import { resetPasswordValidation } from "@/src/validations/auth.validation";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function page() {
  const router=useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const handleResetPassword: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)
      const token = await getResetPasswordToken();
      if (!token) {
          router.push("/find-account");
      }
      const res = await resetPasswordReq({
        token,
        password: data.password,
      });
      if (res?.success && res?.data) {
        router.push("/login");
        toast.success(res?.message);
      }
      if (!res?.success && res?.errorMessages) {
        setError(res?.errorMessages[0]?.message);
      }
      setIsLoading(false)
  };
  return (
    <div className="shadow-small w-full md:max-w-md rounded-md p-5 md:p-10">
      <p className="font-bold text-xl ">Reset Password</p>
      <p className=" text-gray-500 mb-3">
        Please reset your password within 10 minutes.
      </p>
      {error && (
        <Chip
          color="danger"
          variant="flat"
          classNames={{
            closeButton: "text-xl ms-5",
          }}
          onClose={() => setError("")}
        >
          {error}
        </Chip>
      )}
      <JUForm onSubmit={handleResetPassword} validation={resetPasswordValidation}>
        <div className="space-y-2">
          <JUPasswordInput
            name="password"
            inputProps={{ label: "New Password", variant: "bordered" }}
          />
          <JUPasswordInput
            name="confirmPassword"
            inputProps={{ label: "Confirm Password", variant: "bordered" }}
          />

          <div className="mt-2">
            <Button type="submit" color="secondary" size="md" isLoading={isLoading}>
              Submit
            </Button>
          </div>
        </div>
      </JUForm>
    </div>
  );
}
