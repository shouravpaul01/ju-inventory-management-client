"use client";
import { ChangeEvent, useState } from "react";
import { Input, InputProps } from "@heroui/input";
import { useFormContext } from "react-hook-form";
import { Button } from "@heroui/button";
import { MinusIcon, PlusIcon } from "../icons";

interface IProps {
  name: string;
  inputProps?: InputProps;
  className?: string;
  onChange?: (value: number) => void; // Add onChange prop
}

export default function JUNumberInput({ name, inputProps, className, onChange }: IProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const currentValue = watch(name) || 0;

  // Handle increment
  const handleIncrement = () => {
    const newValue = (currentValue || 0) + 1;
    setValue(name, newValue);
    onChange?.(newValue); 
  };

  // Handle decrement
  const handleDecrement = () => {
    const newValue = (currentValue || 0) - 1;
    setValue(name, newValue);
    onChange?.(newValue);
  };

  // Handle manual input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const finalValue = isNaN(newValue) ? 0 : newValue;
    setValue(name, finalValue);
    onChange?.(finalValue); 
  };

  return (
    <>
      <div className={`w-32 flex items-center justify-center gap-1 p-1 border border-gray-200 rounded-md ${className}`}>
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

        {/* Input Field */}
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

      {/* Display validation errors */}
      {errors[name] && (
        <p className="text-red-500">{errors[name]?.message as string}</p>
      )}
    </>
  );
}