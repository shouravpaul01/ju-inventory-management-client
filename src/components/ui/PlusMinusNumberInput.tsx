"use client";
import { Button } from "@nextui-org/button";
import { MinusIcon, PlusIcon } from "../icons";
import { toast } from "sonner";
import React, { useState } from "react";
import { Input } from "@nextui-org/input";

type QuantityInputProps = {
  quantity: number;
  onChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
};

export default function PlusMinusNumberInput({
  quantity,
  onChange,
  min = 1,
  max = Infinity,
}: QuantityInputProps) {
  const [error, setError] = useState("");

  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    } else {
      toast.info(`The minimum quantity is ${min}.`);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    } else {
      toast.info(`The maximum quantity is ${max}.`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    const newQuantity = Number(inputValue);

    setError("");

    if (inputValue === "") {
      setError("Please enter a valid number.");
      return;
    }

    if (newQuantity < min) {
      setError(`Minimum order quantity is ${min}.`);
      return;
    }

    if (newQuantity > max) {
      setError(`Maximum order quantity is ${max}.`);
      return;
    }

    onChange(newQuantity);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      handleIncrement();
    } else if (event.key === "ArrowDown") {
      handleDecrement();
    }
  };

  return (
    <div
      className="w-32 flex  items-center justify-center gap-1 p-1  border border-gray-200 rounded-md"
      onKeyDown={handleKeyDown}
      
    >
      <Button
        size="sm"
        isIconOnly
        color="primary"
        variant="flat"
        radius="full"
        isDisabled={quantity <= min}
        onPress={handleDecrement}
      >
        <MinusIcon className="size-5" />
      </Button>
      <Input
         variant="bordered"
        size="sm"
        className="12"
        type="text"
        defaultValue={quantity?.toString()}
        onChange={handleInputChange}
        errorMessage={error}
        isInvalid={!!error}
      />
      <Button
        size="sm"
        isIconOnly
        color="primary"
        variant="flat"
        radius="full"
        isDisabled={quantity >= max}
        onPress={handleIncrement}
      >
        <PlusIcon className="size-5" />
      </Button>
    </div>
  );
}