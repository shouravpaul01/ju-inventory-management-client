"use client";


import { Textarea, TextAreaProps } from "@heroui/input";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  textareaProps?: TextAreaProps;
  registerOptions?: RegisterOptions;
}

export default function JUTextarea({ name, textareaProps, registerOptions }: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Textarea
      variant="bordered"
      {...register(name, registerOptions)}
      {...textareaProps}
      isInvalid={!!errors[name]}
      errorMessage={errors[name]?.message as string}
    />
  );
}
