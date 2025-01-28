"use client";
import JUForm from "@/src/components/form/JUForm";
import JUPasswordInput from "@/src/components/form/JUPasswordInput";
import {  getResetPasswordToken,  resetPasswordReq } from "@/src/services/Auth";
import { resetPasswordValidation } from "@/src/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function page() {
  const router=useRouter()
  const methods = useForm({ resolver: zodResolver(resetPasswordValidation) });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const handleResetPassword: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)
      const {token} = await getResetPasswordToken();
      console.log(token,"dd",data)
      // if (!!token) {
      //     router.push("/find-account");
      //     return
      // }
      const res = await resetPasswordReq({
        token,
        password: data.password,
      });
      console.log(res)
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
      <div className="mb-3">
      <p className="font-bold text-xl ">Reset Password</p>
      <p className=" text-gray-500  ">
        Please reset your password within 10 minutes.
      </p>
      {error && (
        <Chip
          color="danger"
          variant="flat"
          classNames={{
            base:"h-full flex-wrap",
            content:"text-wrap",
            closeButton: "text-xl ",
          }}
          onClose={() => setError("")}
        >
          {error}
        </Chip>
      )}
      </div>
      <JUForm onSubmit={handleResetPassword} methods={methods}>
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
