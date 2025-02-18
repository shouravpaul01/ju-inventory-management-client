"use client";
import { ChangeEvent, useState } from "react";
import { Input, InputProps } from "@nextui-org/input";
import { useFormContext } from "react-hook-form";
import { Button } from "@nextui-org/button";
import { MinusIcon, PlusIcon } from "../icons";

interface IProps {
  name: string;
  inputProps?: InputProps;
  className?:string
}

export default function JUNumberInput({ name, inputProps ,className}: IProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const currentValue = watch(name) || 0;

  // Handle increment
  const handleIncrement = () => {
    setValue(name, (currentValue || 0) + 1);
  };

  // Handle decrement
  const handleDecrement = () => {
    setValue(name, (currentValue || 0) - 1);
  };

  // Handle manual input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(name, isNaN(newValue) ? 0 : newValue);
  };

  return (
    <>
      <div className={`w-32 flex  items-center justify-center gap-1 p-1  border border-gray-200 rounded-md ${className}`}>
        {/* Decrement Button */}
        <Button
          isIconOnly
          color="primary"
          variant="flat"
          size="sm"
          radius="full"
          onPress={handleDecrement}
          isDisabled={currentValue <= 0}
        >
          <MinusIcon />
        </Button>

        <Input
          variant="bordered"
          size="sm"
          value={currentValue}
          onInput={handleInputChange}
          {...register(name, { valueAsNumber: true })}
          {...inputProps}
          className="w-12"
        />

        {/* Increment Button */}
        <Button
          isIconOnly
          color="primary"
          variant="flat"
          size="sm"
          radius="full"
          onPress={handleIncrement}
        >
          <PlusIcon />
        </Button>
      </div>
      {errors[name] && (
        <p className="text-red-500">{errors[name]?.message as string}</p>
      )}{" "}
    </>
  );
}
