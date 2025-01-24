"use client";
import { Button } from "@nextui-org/button";
import { AddIcon, MinusIcon, PlusIcon } from "../icons";
import { toast } from "sonner";

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
    const handleDecrement = () => {
        if (quantity > min) {
          onChange(quantity - 1);
        } else {
          toast.info("You have reached the minimum quantity.");
        }
      };
    
      const handleIncrement = () => {
        if (quantity < max) {
          onChange(quantity + 1);
        } else {
          toast.info("You have reached the maximum quantity.");
        }
      };

  return (
    <div className="w-28 flex gap-2 p-1 items-center justify-center  border border-gray-200 rounded-md">
      <Button
        size="sm"
        isIconOnly
        color="primary"
        variant="flat"
        radius="full"
        isDisabled={quantity <= min}
        onPress={handleDecrement}
      >
        <MinusIcon className="size-5"/>
      </Button>
      <span>{quantity}</span>
      <Button
        size="sm"
        isIconOnly
        color="primary"
        variant="flat"
        radius="full"
        isDisabled={quantity >= max}
        onPress={handleIncrement}
      >
        <PlusIcon className="size-5"/>
      </Button>
    </div>
  );
}
