"use client";

import { Input, InputProps } from "@nextui-org/input";
import { useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  inputProps?: InputProps;
}
export default function JUInput({ name, inputProps}: IProps) {
  const { register,formState:{errors} } = useFormContext();
 
  return <Input variant="bordered"  {...register(name)} {...inputProps} isInvalid={!!errors[name]}
  errorMessage={errors[name]?.message as string}/>;
}
