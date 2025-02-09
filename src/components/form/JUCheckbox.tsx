"use client";

import { Checkbox, CheckboxProps } from "@nextui-org/checkbox";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  label?: string;
  checkboxProps?: CheckboxProps;
  registerOptions?: RegisterOptions;
}

export default function JUCheckbox({
  name,
  label,
  checkboxProps,
  registerOptions,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Checkbox
      {...register(name, registerOptions)}
      {...checkboxProps}
      isInvalid={!!errors[name]}
      color="primary"
    >
      {label || checkboxProps?.children}
    </Checkbox>
  );
}
