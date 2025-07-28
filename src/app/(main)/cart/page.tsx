"use client";
import JUForm from "@/src/components/form/JUForm";
import JUNumberInput from "@/src/components/form/JUNumberInput";
import { ArrowRightAltIcon, XmarkIcon } from "@/src/components/icons";
import { useCart } from "@/src/hooks/cart";
import { createOrderReq } from "@/src/services/order";
import { cartItemSchemaValidation } from "@/src/validations/cart.validation";
import { Checkbox } from "@heroui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { User } from "@heroui/user";
import { useQueryClient } from "@tanstack/react-query";
import { ifError } from "assert";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAllAccessories } from "@/src/hooks/Accessory";

export default function CartPage() {
  const queryClient = useQueryClient();
  const methods = useForm({ resolver: zodResolver(cartItemSchemaValidation) });
  const {
    watch,
    formState: { errors },
  } = methods;
  const {
    cart,
    updateSelection,
    updateOrderQuantity,
    removeFromCart,
    removeAllFromCart,
  } = useCart();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectedDistributeOption, setIsSelectedDistributeOption] =
    useState<boolean>(false);

    
  const selectedItems = useMemo(
    () => cart.filter((item) => item.isSelected).map((item) => item._id),
    [cart]
  );

  const handleSelectedItem = (id: string) => {
    const isSelected = selectedItems.includes(id);

    updateSelection({ id, isSelected: !isSelected });
  };

  const handleSelectAll = () => {
    const isAllSelected = selectedItems.length === cart?.length;

    const updatedCart = cart.map((item) => ({
      ...item,
      isSelected: !isAllSelected,
    }));

    queryClient.setQueryData(["cart"], updatedCart);
  };
  useEffect(() => {
    if (cart) {
      const defaultValues = cart.map((item) => ({
        accessory: item._id,
        expectedQuantity: item.expectedQuantity,
        
      }));

      methods.reset({ items: defaultValues });
    }
  }, [cart]);
  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateOrderQuantity({ id, newQuantity });
  };
  const handleSubmitConfirmOrder: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const res = await createOrderReq(data?.items);
    if (res?.success) {
      toast.success(res?.message);
      removeAllFromCart();
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "orderError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="my-11">
      <div className="flex items-center justify-center border rounded-md p-4 ">
        <Checkbox
          isSelected={isSelectedDistributeOption}
          onValueChange={setIsSelectedDistributeOption}
          classNames={{ label: "text-sm md:text-base" }}
        >
          Do you want to distribute accessories?
        </Checkbox>
      </div>
      <JUForm methods={methods} onSubmit={handleSubmitConfirmOrder}>
        <Table
          aria-label="Controlled table example with dynamic content"
          shadow="none"
          classNames={{ wrapper: "px-0 md:px-4" }}
        >
          <TableHeader>
            <TableColumn>
              {cart?.length > 0 && (
                <Checkbox
                  isSelected={selectedItems.length === cart?.length}
                  isIndeterminate={
                    selectedItems.length > 0 &&
                    selectedItems.length < cart?.length
                  }
                  onChange={handleSelectAll}
                />
              )}
            </TableColumn>

            <TableColumn>NAME</TableColumn>

            <TableColumn>Quantity</TableColumn>
            <TableColumn>ACTION</TableColumn>
          </TableHeader>
          <TableBody>
            {cart && cart?.length > 0 ? (
              cart?.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Checkbox
                      isSelected={selectedItems.includes(item._id)}
                      onChange={() => handleSelectedItem(item._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <User
                      avatarProps={{ radius: "lg", src: item.image }}
                      description={
                        <Chip
                          color="warning"
                          size="sm"
                          classNames={{ content: "text-center w-26" }}
                        >
                          {item?.isItReturnable
                            ? "Returnable"
                            : "Non-returnable"}
                        </Chip>
                      }
                      name={<p className="line-clamp-1">{item.name}</p>}
                    ></User>
                  </TableCell>
                  <TableCell>
                    <div>
                      <JUNumberInput
                        name={`items.${index}.expectedQuantity`}
                        onChange={(value: any) =>
                          handleQuantityChange(item._id!, value)
                        }
                      />
                      {errors?.items &&
                        (errors as FieldValues)?.items[index]
                          ?.expectedQuantity && (
                          <p className="text-red-500">
                            {
                              (errors as FieldValues)?.items[index]
                                ?.expectedQuantity?.message
                            }
                          </p>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      size="sm"
                      radius="full"
                      color="default"
                      onPress={() => removeFromCart(item._id)}
                    >
                      <XmarkIcon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {cart.length > 0 && (
          <div className="flex gap-3 justify-end mx-6 my-6">
            {isSelectedDistributeOption ? (
              <Button
                as={Link}
                href="/distribute"
                size="sm"
                color="primary"
                isDisabled={selectedItems.length === 0}
                startContent={
                  !isLoading && <ArrowRightAltIcon className="fill-white" />
                }
              >
                Proceed to Distribute
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                color="primary"
                isLoading={isLoading}
                isDisabled={selectedItems.length === 0}
                startContent={
                  !isLoading && <ArrowRightAltIcon className="fill-white" />
                }
              >
                Proceed To Order
              </Button>
            )}
          </div>
        )}
      </JUForm>
    </div>
  );
}
