"use client";
import { Input, InputProps } from "@heroui/input";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  inputProps?: InputProps;
}
export default function JUPasswordInput({ name, inputProps }: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      {...register(name)}
      {...inputProps}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      isInvalid={!!errors[name]}
      errorMessage={errors[name]?.message as string}
    />
  );
}
