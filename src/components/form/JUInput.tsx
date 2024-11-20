"use client";

import { Input, InputProps } from "@nextui-org/input";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  inputProps?: InputProps;
  registerOptions?:RegisterOptions
}
export default function JUInput({ name, inputProps,registerOptions}: IProps) {
  const { register,formState:{errors} } = useFormContext();
 
  return <Input variant="bordered"  {...register(name,registerOptions)} {...inputProps} isInvalid={!!errors[name]}
  errorMessage={errors[name]?.message as string}/>;
}
