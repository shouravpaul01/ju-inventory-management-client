"use client";
import { Button } from "@heroui/button";
import { MinusIcon, PlusIcon } from "../icons";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { Input } from "@heroui/input";

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
  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

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
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    const newQuantity = Number(inputValue);

    setError("");
console.log(newQuantity,"jj")
    if (inputValue === "") {
      console.log("1")
      setError("Please enter a valid number.");
      setLocalQuantity(quantity);
      return;
    }

    if (newQuantity < min) {
      console.log("2")
      setError(`Minimum order quantity is ${min}.`);
      setLocalQuantity(quantity);
      return;
    }

    if (newQuantity > max) {
      console.log("3")
      setError(`Maximum order quantity is ${max}.`);
      setLocalQuantity(quantity);
      return;
    }
    console.log("4")
    setLocalQuantity(newQuantity);
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
    <div>
    <div
      className="w-32 flex items-center justify-center gap-1 p-1 border border-gray-200 rounded-md hover:border-primary transition-colors"
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
        aria-label="Decrease quantity"
        className="hover:bg-primary hover:fill-white"
      >
        <MinusIcon className="size-5 " />
      </Button>

      <Input
        variant="bordered"
        size="sm"
        className="w-12"
        type="text"
        value={localQuantity.toString()}
        onChange={handleInputChange}
       
        aria-label="Quantity input"
        placeholder="Qty"
        classNames={{
          input: "text-center",
        }}
      />

      <Button
        size="sm"
        isIconOnly
        color="primary"
        variant="flat"
        radius="full"
        isDisabled={quantity >= max}
        onPress={handleIncrement}
        aria-label="Increase quantity"
        className="hover:bg-primary-100"
      >
        <PlusIcon className="size-5" />
      </Button>
    </div>
    {
      error && <p className="text-red-500 p-1">{error}</p>
    }
    </div>
  );
}