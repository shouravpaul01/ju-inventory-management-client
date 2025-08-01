"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { User } from "@heroui/user";
import JUForm from "@/src/components/form/JUForm";
import { useCart } from "@/src/hooks/cart";
import { FieldValues, useForm } from "react-hook-form";
import { Chip } from "@heroui/chip";
import JUNumberInput from "@/src/components/form/JUNumberInput";
import { Button } from "@heroui/button";
import {
  ArrowRightAltIcon,
  ImageIcon,
  XmarkIcon,
} from "@/src/components/icons";
import { useEffect, useMemo, useState } from "react";
import { locationTypeOptions, TAccessoryCartItem, TQuery } from "@/src/types";
import { getAllAccessories } from "@/src/hooks/Accessory";
import JUSelect from "@/src/components/form/JUSelect";
import { string } from "zod";
import { Avatar } from "@heroui/avatar";
import JULoading from "@/src/components/ui/JULoading";
import { useRouter } from "next/navigation";
import JUInput from "@/src/components/form/JUInput";

const Distributepage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    cart,
    updateSelection,
    updateOrderQuantity,
    removeFromCart,
    removeAllFromCart,
  } = useCart();
  const queryParams = useMemo(() => {
    if (!cart) return [];
    return cart
      .filter((item) => item.isSelected)
      .map((item) => ({ name: "_id", value: item._id }));
  }, [cart]);

  const { data: accessories, isLoading: isAccessoriesLoading } =
    getAllAccessories({ query: queryParams });
  const distributeAccessories = useMemo(() => {
    if (!cart || !accessories) return [];

    return cart
      .filter((item) => item.isSelected)
      ?.map((cartItem) => {
        const matchingAccessory = accessories?.data?.find(
          (accessory) => accessory._id === cartItem._id
        );
        return {
          ...cartItem,
          currentCodes: matchingAccessory?.codeDetails?.currentCodes,
        };
      });
  }, [cart, accessories]);
  console.log(distributeAccessories, "accs");
  const methods = useForm({});
  const {
    watch,
    formState: { errors },
  } = methods;
   useEffect(() => {
     if (cart) {
       const defaultValues = cart.map((item) => ({
         distributeAccessories: item._id,
         distributedQuantity: item.expectedQuantity,
         
       }));
 
       methods.reset({ items: defaultValues });
     }
   }, [distributeAccessories]);
  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateOrderQuantity({ id, newQuantity });
  };
  if (isAccessoriesLoading) {
    return <JULoading />;
  }
  if (cart?.length === 0) {
    return router.push("/");
  }
  return (
    <div className="my-11">
      <JUForm methods={methods} onSubmit={() => {}}>
        <Table
          aria-label="Controlled table example with dynamic content"
          shadow="none"
          classNames={{ wrapper: "px-0 md:px-4" }}
        >
          <TableHeader>
            <TableColumn width={450}>NAME</TableColumn>

            <TableColumn>Provide Quantity</TableColumn>
            <TableColumn width={350}>Provide Accessories code</TableColumn>
            <TableColumn width={200}>Action</TableColumn>
          </TableHeader>
          {distributeAccessories && distributeAccessories?.length > 0 ? (
            <TableBody>
              {distributeAccessories?.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <Avatar
                          radius="md"
                          fallback={<ImageIcon />}
                          className="size-20 text-large"
                          src={item?.image}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold line-clamp-1">{item?.name}</p>

                        <Chip size="sm" color="warning">
                          {item?.isItReturnable
                            ? "Returnable"
                            : "Non-returnable"}
                        </Chip>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <JUNumberInput
                        name={`items.${index}.distributedQuantity`}
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
                    {item.isItReturnable ? (
                      <JUSelect
                        options={item?.currentCodes!?.sort().map((element) => ({
                          value: element,
                          label: element,
                        }))}
                        name={`items.${index}.providedAccessoryCodes`}
                        selectProps={{
                          className: "max-w-[300px]",
                          selectionMode: "multiple",
                          labelPlacement: "outside",
                          placeholder: "Select Codes",

                          classNames: { label: "text-sm" },
                        }}
                      />
                    ) : (
                      <p className="text-slate-600">
                        The order item is non-returnable, so the return deadline
                        and codes will not be provided.
                      </p>
                    )}
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
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell className="text-center">No items found.</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <div>
          <div>
            <label className="text-base font-semibold">Distribute For:</label>
            <JUInput name="distri" inputProps={{className:"max-w-lg" ,placeholder:"Name"}}/>
          </div>
          <div>
            <JUSelect selectProps={{label: "Location Type"}} options={locationTypeOptions} name="locationType"/>
          </div>
        </div>
        {cart.length > 0 && (
          <div className="flex gap-3 justify-end mx-6 my-6">
            <Button
              href="/distribute"
              size="sm"
              color="primary"
              startContent={
                !isLoading && <ArrowRightAltIcon className="fill-white" />
              }
            >
              Confirm Distribution Process
            </Button>
          </div>
        )}
      </JUForm>
    </div>
  );
};

export default Distributepage;
