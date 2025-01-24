"use client";
import { ArrowRightAltIcon, XmarkIcon } from "@/src/components/icons";
import PlusMinusNumberInput from "@/src/components/ui/PlusMinusNumberInput";
import { useCart } from "@/src/hooks/cart";
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
import { useMemo } from "react";

export default function CartPage() {
  const queryClient = useQueryClient();
  const { cart, updateSelection, removeFromCart } = useCart();

  const selectedItems = useMemo(
    () => cart.filter((item) => item.isSelected).map((item) => item._id),
    [cart]
  );

  const handleSelectedItem = (id: string) => {
    const isSelected = selectedItems.includes(id);
    console.log(id, isSelected, selectedItems, "key");
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
  const handleQuantityChange = (id: string, newQuantity: number) => {
    const updatedItem = cart.find((item) => item._id === id);

    if (!updatedItem) return;

    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );

    queryClient.setQueryData(["cart"], updatedCart);
  };
  console.log(cart, "cart");
  console.log(selectedItems, "cart");
  return (
    <div className="my-11">
      <Table
        aria-label="Controlled table example with dynamic content"
        shadow="none"
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
        <TableBody items={cart} emptyContent={"No users found"}>
          {(item) => (
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
                        {item?.isItReturnable ? "Returnable" : "Non-returnable"}
                      </Chip>
                    </div>
                  }
                  name={item.name}
                ></User>
              </TableCell>
              <TableCell>
                <div>
                  <PlusMinusNumberInput
                    quantity={item.quantity!}
                    onChange={(newQuantity) =>
                      handleQuantityChange(item._id, newQuantity)
                    }
                    max={item.currentQuantity}
                  />
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
          )}
        </TableBody>
      </Table>
      <div className="flex gap-3 justify-end mx-6 my-6">
        <Button
          size="sm"
          color="primary"
          isDisabled={selectedItems.length === 0}
          startContent={
            <span>
              <ArrowRightAltIcon className="fill-white" />
            </span>
          }
        >
          Proceed To Order
        </Button>
        <Button
          size="sm"
          color="primary"
          isDisabled={selectedItems.length === 0}
        >
          Proceed to Distribution
        </Button>
      </div>
    </div>
  );
}
