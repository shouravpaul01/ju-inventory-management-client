"use client";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUPasswordInput from "@/src/components/form/JUPasswordInput";
import { LoginIcon } from "@/src/components/icons";
import { loginReq } from "@/src/services/Auth";
import { TErrorMessage } from "@/src/types";
import { loginValidation } from "@/src/validations/auth.validation";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import Image from "next/image";
import { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<TErrorMessage[]>([]);
  const [authError, setAuthError] = useState<string>("");
  const handleLogin: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const res = await loginReq(data);

    if (res?.success) {
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "authError") {
        setAuthError(res?.errorMessages[0]?.message);
        
    setIsLoading(false);
        return;
      }
      setValidationErrors(res?.errorMessages);
    }

    setIsLoading(false);
  };
  return (
    <div className="w-full md:max-w-5xl flex flex-col md:flex-row gap-8 bg-white rounded-xl md:shadow-small p-5  md:p-10 ">
      <div className="w-full md:w-1/2 flex flex-col gap-3 items-center justify-center">
        <div className="relative">
          <div className="w-28 h-28 border border-dashed border-violet-700 rounded-full" />
          <Image
            src="/ju-logo.png"
            alt="logo"
            width={70}
            height={70}
            className="absolute top-4 left-[22px]"
          />
        </div>
        <div className="text-center">
          <p className="text-md md:text-2xl font-bold  text-violet-800">
            Jahangirnagar University
          </p>
          <p className="text-slate-500  font-bold">
            Department of Computer Science and Engineering
          </p>
          <p className="text-slate-500">Inventory Management</p>
        </div>
      </div>
      <div className="border border-dashed border-secondary-200 hidden md:block"></div>
      <div className="w-full md:w-1/2">
        <div className=" ps-0 md:ps-3">
         <div className="mb-3">
         <h1 className="text-2xl font-semibold  text-center md:text-start">
            Login{" "}
          </h1>
          {authError && <Chip onClose={() => setAuthError('')} variant="flat" color="danger" className="mt-1" classNames={{closeButton:"ms-4"}}>
        {authError}
      </Chip>}
         </div>
          <JUForm
            onSubmit={handleLogin}
            validation={loginValidation}
            errors={validationErrors}
          >
            <div className="space-y-2">
              <JUInput
                name="userId"
               
                inputProps={{
                  type: "text",
                  variant: "bordered",
                  label: "User ID",
                  classNames:{input:"uppercase"}
                }}
              />

              <JUPasswordInput
                name="password"
                inputProps={{
                  variant: "bordered",
                  label: "Password",
                  
                }}
              />
              <Button
                isLoading={isLoading}
                type="submit"
                color="primary"
                variant="shadow"
                radius="sm"
                className="w-full mt-3"
                startContent={
                  !isLoading && <LoginIcon className="fill-white" />
                }
              >
                Login
              </Button>
            </div>
          </JUForm>

          <Link href="/find-account" underline="always" showAnchorIcon className="ms-2 mt-2" >
            Forget Password
          </Link>
        </div>
      </div>
    </div>
  );
}
