"use client";

import { DatePicker, DatePickerProps } from "@heroui/date-picker";

import { Controller, useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  inputProps: DatePickerProps | any;
}

export default function JUDatePicker({ name, inputProps }: IProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
 

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null as any}
      render={({ field: { ref, ...field } }) => (
        <DatePicker

          {...inputProps}
          value={field.value ?? null}
          onChange={field.onChange}
          isInvalid={!!errors[name]}
          errorMessage={errors[name]?.message as string}
        />
      )}
    />
  );
}
