"use client";
import JUForm from "@/src/components/form/JUForm";
import JUNumberInput from "@/src/components/form/JUNumberInput";
import { ArrowRightAltIcon, XmarkIcon } from "@/src/components/icons";
import PlusMinusNumberInput from "@/src/components/ui/PlusMinusNumberInput";
import { useCart } from "@/src/hooks/cart";
import { createOrderReq } from "@/src/services/order";
import { TAccessoryCartItem } from "@/src/types";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { User } from "@nextui-org/user";
import { useQueryClient } from "@tanstack/react-query";
import { ifError } from "assert";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CartPage() {
  const queryClient = useQueryClient();
  const methods = useForm();
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
  useEffect(()=>{
    if (cart) {
      const defaultValues = cart.map((item) => ({
              accessory: item._id,
              isItReturnable: item?.isItReturnable,
              expectedQuantity: item.expectedQuantity,
              // currentQuantity: (item.accessory as TAccessory)?.quantityDetails
              //   ?.currentQuantity,
              // providedQuantity: item.providedQuantity || item.expectedQuantity,
              // providedAccessoryCodes: item.providedAccessoryCodes.map((element) => ({
              //   value: element,
              //   label: element,
              // })),
              
            }));
            
            methods.reset({ items: defaultValues });
    }
  },[cart])
  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateOrderQuantity({ id, newQuantity });
  };
  const handleSubmitConfirmOrder = async (cartItems: TAccessoryCartItem[]) => {
    if (cartItems.length <= 0) {
      toast.error("Order failed to proceed. Please try again.");
    }
    setIsLoading(true);

    const orderItems = cartItems?.map((item) => ({
      accessory: item._id,
      expectedQuantity: item.expectedQuantity,
    }));
    const res = await createOrderReq(orderItems);
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
  console.log(cart);
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
            {cart?.length > 0 ? (
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
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">T.Quantity :</span>
                            <Chip color="success" size="sm">
                              {item.currentQuantity}
                            </Chip>
                          </div>
                          <Chip
                            color="warning"
                            size="sm"
                            classNames={{ content: "text-center w-26" }}
                          >
                            {item?.isItReturnable
                              ? "Returnable"
                              : "Non-returnable"}
                          </Chip>
                        </div>
                      }
                      name={item.name}
                    ></User>
                  </TableCell>
                  <TableCell>
                    <div>
                      <JUNumberInput name={`items.${index}.expectedQuantity`} />
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
