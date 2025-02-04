"use client"; // Mark this as a client-side component
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import { DatePicker, DatePickerProps } from "@nextui-org/date-picker";
import React from "react";

import { useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  inputProps?: DatePickerProps;
  
}

export default function JUDatePicker({ name,inputProps }: IProps) {
  const {
    
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  
  const currentValue = watch(name);

  // Handle date change
  const handleDateChange = (
    date: CalendarDate | CalendarDateTime | ZonedDateTime | null
  ) => {
    setValue(name, date); 
  };

  return (
    <DatePicker
      value={currentValue || null}
      onChange={handleDateChange}
      {...inputProps}
      isInvalid={!!errors[name]}
      errorMessage={errors[name]?.message as string}
    />
  );
}
