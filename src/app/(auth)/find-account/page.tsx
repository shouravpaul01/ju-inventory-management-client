"use client";

import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import { XmarkIcon } from "@/src/components/icons";
import { cencelVerificationProcces, sendOTPReq } from "@/src/services/Auth";
import { getSingleUserReq } from "@/src/services/User";
// import { getSingleUserByEmailReq } from "@/src/services/UserService";
import { TUser } from "@/src/types";
import { findAccountValidation } from "@/src/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { User } from "@heroui/user";
import {  useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export default function FindAccountPage() {
  const router = useRouter();
  const methods = useForm({ resolver: zodResolver(findAccountValidation) });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [user, setUser] = useState<Partial<TUser> | null>();

  const handleFindAccount: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const res = await getSingleUserReq(data.userIdorEmail);

    if (res?.success && res?.data) {
      setUser(res.data);
      setError("");
    }
    if (!res?.success && res?.errorMessages) {
      setError(res?.errorMessages[0]?.message);
      setUser(null);
    }
    setIsLoading(false);
  };
  const handleSendOTP = async (email: string) => {
    setIsLoading(true);
    const res = await sendOTPReq(email);

    if (res?.success && res?.data) {
      router.push("/verify-identity");
    }
    if (!res?.status && res?.errorMessages) {
      setError(res?.errorMessages[0]?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="shadow-small w-full md:max-w-md rounded-md p-8">
      <p className="font-bold text-xl">Find your account..</p>
      <p className=" text-gray-500">
        Please enter your User ID or Email address to search for your account.
      </p>
      {error && (
        <Chip color="danger" variant="flat" onClose={() => setError("")}>
          {error}
        </Chip>
      )}
      <JUForm onSubmit={handleFindAccount} methods={methods}>
        <JUInput
          name="userIdorEmail"
          inputProps={{
            variant: "bordered",
            label: "User ID or Email",

            className: "mt-2",
          }}
        />
        {user && (
          <div className="mt-5">
            <p className="text-xl font-bold mb-3">Your Account</p>
            <div className="flex  items-center ">
              <div className="flex-1">
                <User
                  name={user.faculty?.name}
                  description={
                    <div>
                      <p>ID: {user.userId}</p>
                      <p>Email: {user.email}</p>
                    </div>
                  }
                  avatarProps={{
                    src: user.faculty?.image,
                  }}
                />
              </div>

              <Button
                variant="flat"
                className="bg-black bg-opacity-50 "
                isIconOnly
                radius="full"
                onPress={() => setUser(null)}
              >
                <XmarkIcon className="fill-white" />
              </Button>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-3">
          <Button
            variant="faded"
            color="primary"
            onPress={() => cencelVerificationProcces()}
          >
            Cencel
          </Button>
          {user ? (
            <Button
              color="primary"
              isLoading={isLoading}
              onPress={() => handleSendOTP(user?.email!)}
            >
              Send OTP
            </Button>
          ) : (
            <Button type="submit" color="primary" isLoading={isLoading}>
              Submit
            </Button>
          )}
        </div>
      </JUForm>
      <div></div>
    </div>
  );
}
