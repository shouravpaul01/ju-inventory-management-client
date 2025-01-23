"use client";
import { useCart } from "@/src/hooks/cart";
import { TAccessoryCartItem } from "@/src/types";
import { Checkbox } from "@heroui/checkbox";
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
  const { cart, updateCart, updateSelection } = useCart();

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

    updateCart(updatedCart).then(() => {
      queryClient.setQueryData(["cart"], updatedCart);
    });
  };
  console.log(cart, "cart");
  console.log(selectedItems, "cart");
  return (
    <div className="my-11">
      <Table aria-label="Controlled table example with dynamic content">
        <TableHeader>
          <TableColumn>
            <Checkbox
              isSelected={selectedItems.length === cart?.length}
              isIndeterminate={
                selectedItems.length > 0 && selectedItems.length < cart?.length
              }
              onChange={handleSelectAll}
            />
          </TableColumn>

          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody items={cart}>
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
                  name={item.name}
                >
                  {item.currentQuantity}
                </User>
              </TableCell>
              <TableCell>Community Manager</TableCell>
              <TableCell>Vacation</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
