"use client";
import JUCheckbox from "@/src/components/form/JUCheckbox";
import JUDatePicker from "@/src/components/form/JUDatePicker";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUNumberInput from "@/src/components/form/JUNumberInput";
import JUSelect from "@/src/components/form/JUSelect";
import {
  ArrowRightAltIcon,
  CycleIcon,
  EditIcon,
  ImageIcon,
  InfoIcon,
  InputIcon,
  MoreHorzIcon,
  MoreIcon,
  XmarkIcon,
} from "@/src/components/icons";
import JULoading from "@/src/components/ui/JULoading";
import { getSingleOrder } from "@/src/hooks/order";
import {
  returnedAccessoriesCodesReq,
  updateExpectedQuantityReq,
  updateOrderItemsReq,
} from "@/src/services/order";
import { TAccessory, TErrorMessage } from "@/src/types";
import isEventExists from "@/src/utils/isEventExists";
import {
  orderedItemSchemaValidation,
  returnedItemSchemValidation,
  updateExpectedQuantitySchemValidation,
} from "@/src/validations/order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { code, divider } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseDate } from "@internationalized/date";

export default function ReturnableAccessories({
  useDisclosure,
  orderId,
}: {
  useDisclosure: UseDisclosureProps | any;
  orderId: string;
}) {
  const queryClient = useQueryClient();
  const [isSubmitLoading, setSubmitLoading] = useState<any>(null);

  const [returnItem, setReturnItem] = useState<string | null>(null);
  const methods = useForm({
    resolver: zodResolver(returnedItemSchemValidation),
  });
  const { data: order, isLoading: isOrderLoading } = getSingleOrder(orderId);
  console.log(orderId, "orderId");
  const {
    watch,
    formState: { errors },
  } = methods;
  useEffect(() => {
    if (order) {
      const defaultValues = order.items.map((item) => ({
        accessory: (item.accessory as TAccessory)?._id,
        isItReturnable: (item.accessory as TAccessory)?.isItReturnable,
        expectedQuantity: item.expectedQuantity,
        currentQuantity: (item.accessory as TAccessory)?.quantityDetails
          ?.currentQuantity,
        providedQuantity: item.providedQuantity || item.expectedQuantity,
        providedAccessoryCodes: item.providedAccessoryCodes.map((element) => ({
          value: element,
          label: element,
        })),
        returnDeadline: parseDate(
          dayjs(item.returnDeadline as any).format("YYYY-MM-DD")
        ),
        isProvided: item.isProvided,
      }));

      methods.reset({ items: defaultValues });
    }
    if (!useDisclosure.isOpen) {
      methods.reset();

      setReturnItem(null);
    }
  }, [order, useDisclosure]);
  console.log(order, "ho");

  const handleReturnedSubmit = async (index: number, accessory: string) => {
    setSubmitLoading({ _id: accessory });

    // Validate only the current row's fields
    const isValid = await methods.trigger(`items.${index}`);

    if (isValid) {
      const rowData = methods.getValues(`items.${index}`);
      const updateReturnedData: any = { accessory };
      if (rowData?.returnedAccessoriesCodes && rowData?.returnDeadline) {
        updateReturnedData.returnedAccessoriesCodes =
          rowData.returnedAccessoriesCodes
            ?.split(",")
            .map((code: any) => code.trim())
            .sort();
      }
      console.log(updateReturnedData, "after");
      const res = await returnedAccessoriesCodesReq(
        order?._id!,
        updateReturnedData
      );
      console.log(res, "res");
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["single-order"] });
        setReturnItem(null);
        toast.success(res?.message);
      } else if (!res?.success && res?.errorMessages?.length > 0) {
        if (res?.errorMessages[0]?.path == "orderError") {
          toast.error(res?.errorMessages[0]?.message);
        }

        res?.errorMessages?.forEach((err: TErrorMessage) => {
          methods.setError(err.path, { type: "server", message: err.message });
        });
      }
    }

    setSubmitLoading(null);
  };

  return (
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      size="5xl"
      classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
    >
      <ModalContent>
        {(onClose) => (
          <JUForm methods={methods} onSubmit={() => {}}>
            <ModalHeader className="flex flex-col gap-1">
              {isOrderLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : (
                "Returnable Accessories"
              )}
            </ModalHeader>
            {isOrderLoading ? (
              <JULoading className="h-[300px]" />
            ) : (
              <ModalBody>
                <Table
                  aria-label="Example table with client side pagination"
                  shadow="none"
                  classNames={{
                    wrapper: "min-h-[222px] ",
                  }}
                >
                  <TableHeader>
                    <TableColumn key="item" width={280}>
                      Item
                    </TableColumn>
                    <TableColumn key="expectedQty" width={150}>
                      Order Qty
                    </TableColumn>
                    <TableColumn key="providedQty" width={320}>
                      {isEventExists({
                        events: order?.events!,
                        checkEvent: "approved",
                      })
                        ? "Accessory Codes"
                        : "Accessories"}
                    </TableColumn>

                    <TableColumn key="action">Action</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {order?.items && order.items.length > 0 ? (
                      order.items
                        .filter(
                          (item) =>
                            (item.accessory as TAccessory)?.isItReturnable
                        )
                        .map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div>
                                  <Avatar
                                    radius="md"
                                    fallback={<ImageIcon />}
                                    className="size-20 text-large"
                                    src={(item.accessory as TAccessory)?.image}
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="font-bold line-clamp-1">
                                    {(item.accessory as TAccessory)?.name}
                                  </p>

                                  <Chip size="sm" color="warning">
                                    {(item.accessory as TAccessory)
                                      ?.isItReturnable
                                      ? "Returnable"
                                      : "Non-returnable"}
                                  </Chip>
                                  <Chip
                                    size="sm"
                                    color={
                                      item.isProvided ? "success" : "danger"
                                    }
                                  >
                                    {item.isProvided
                                      ? "Provided"
                                      : "Not Provided"}
                                  </Chip>
                                  {(item.accessory as TAccessory)
                                    ?.isItReturnable && (
                                    <div className="flex items-center gap-1">
                                      <span className="block">Return D:</span>
                                      <Chip
                                        key={index}
                                        size="sm"
                                        color="success"
                                        radius="full"
                                      >
                                        {dayjs(item.returnDeadline).format(
                                          "MMM D, YYYY"
                                        )}
                                      </Chip>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex gap-2">
                                  <span>Expected Qty:</span>
                                  <Chip size="sm" radius="md" color="success">
                                    {item?.expectedQuantity}
                                  </Chip>
                                </div>

                                {isEventExists({
                                  events: order?.events!,
                                  checkEvent: "approved",
                                }) &&
                                  item?.isProvided && (
                                    <div className="flex gap-2">
                                      <span>Provided Qty:</span>
                                      <Chip
                                        size="sm"
                                        color="success"
                                        radius="md"
                                      >
                                        {item?.providedQuantity}
                                      </Chip>
                                    </div>
                                  )}
                                {isEventExists({
                                  events: order?.events!,
                                  checkEvent: "approved",
                                }) &&
                                  item.returnedQuantity > 0 && (
                                    <div className="flex gap-2">
                                      <span>Returned Qty:</span>
                                      <Chip
                                        size="sm"
                                        color={
                                          item.providedQuantity ===
                                          item.returnedQuantity
                                            ? "success"
                                            : "danger"
                                        }
                                        radius="md"
                                      >
                                        {item?.returnedQuantity}
                                      </Chip>
                                    </div>
                                  )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div>
                                <div className="space-y-1">
                                  <span className="block">Provided Codes:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {item?.providedAccessoryCodes
                                      ?.slice(0, 2)
                                      ?.map((code, index) => (
                                        <Chip
                                          key={index}
                                          size="sm"
                                          color={item?.returnedAllAccessoriesCodes?.includes(code)?"success":"warning"}
                                          radius="full"
                                        >
                                          {code}
                                        </Chip>
                                      ))}{" "}
                                    {item?.providedAccessoryCodes?.length >
                                      1 && (
                                      <Tooltip
                                        content={
                                          <div className="flex flex-wrap gap-1">
                                            {item?.providedAccessoryCodes?.map(
                                              (code, index) => (
                                                <Chip
                                                  key={index}
                                                  size="sm"
                                                  color="success"
                                                  radius="full"
                                                >
                                                  {code}
                                                </Chip>
                                              )
                                            )}
                                          </div>
                                        }
                                      >
                                        <Button
                                          isIconOnly
                                          radius="md"
                                          color="primary"
                                          variant="light"
                                          size="sm"
                                        >
                                          <MoreHorzIcon />
                                        </Button>
                                      </Tooltip>
                                    )}
                                  </div>
                                </div>
                              </div>
                            {/* </TableCell>
                            <TableCell> */}
                              <>
                                {returnItem ==
                                  (item.accessory as TAccessory)?._id! && (
                                  <div className="space-y-1">
                                    <JUSelect
                                      options={item?.providedAccessoryCodes
                                        .sort()
                                        .filter(
                                          (element) =>
                                            !item?.returnedAllAccessoriesCodes.includes(
                                              element
                                            )
                                        )
                                        .map((element) => ({
                                          value: element,
                                          label: element,
                                        }))}
                                      name={`items.${index}.returnedAccessoriesCodes`}
                                      selectProps={{
                                        className: "max-w-[300px]",
                                        selectionMode: "multiple",
                                        label: "Return Codes:",
                                        labelPlacement: "outside",
                                        placeholder: "Select Codes",

                                        isClearable: true,
                                        classNames: { label: "text-sm" },
                                      }}
                                    />
                                    {errors?.items &&
                                      (errors as FieldValues)?.items[index]
                                        ?.returnedAccessoriesCodes && (
                                        <p className="text-red-500">
                                          {
                                            (errors as FieldValues)?.items[
                                              index
                                            ]?.returnedAccessoriesCodes?.message
                                          }
                                        </p>
                                      )}
                                  </div>
                                )}
                              </>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {(item.accessory as TAccessory)
                                  ?.isItReturnable &&
                                  isEventExists({
                                    events: order?.events!,
                                    checkEvent: "approved",
                                  }) &&
                                  isEventExists({
                                    events: order?.events!,
                                    checkEvent: "delivered",
                                  }) &&
                                  (returnItem ==
                                  (item.accessory as TAccessory)._id ? (
                                    <Button
                                      color="primary"
                                      variant="shadow"
                                      size="sm"
                                      startContent={
                                        <InputIcon className="fill-white" />
                                      }
                                      isLoading={
                                        isSubmitLoading?._id ===
                                        (item.accessory as TAccessory)?._id!
                                      }
                                      onPress={() =>
                                        handleReturnedSubmit(
                                          index,
                                          (item.accessory as TAccessory)._id!
                                        )
                                      }
                                    >
                                      Return Submit
                                    </Button>
                                  ) : (
                                    <Button
                                      color="primary"
                                      variant="flat"
                                      size="sm"
                                      startContent={<ArrowRightAltIcon />}
                                      onPress={() =>
                                        setReturnItem(
                                          (item.accessory as TAccessory)._id!
                                        )
                                      }
                                    >
                                      Return
                                    </Button>
                                  ))}

                                <Button
                                  color="primary"
                                  variant="flat"
                                  size="sm"
                                  startContent={<InfoIcon />}
                                >
                                  Item Info
                                </Button>
                                {returnItem ==
                                  (item.accessory as TAccessory)._id && (
                                  <Button
                                    color="default"
                                    variant="flat"
                                    size="sm"
                                    className="hover:secondary"
                                    startContent={<XmarkIcon />}
                                    onPress={() => {
                                      setReturnItem(null);
                                      methods.resetField(`items.${index}`);
                                    }}
                                  ></Button>
                                )}
                              </div>
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
              </ModalBody>
            )}
            <ModalFooter> </ModalFooter>
          </JUForm>
        )}
      </ModalContent>
    </Modal>
  );
}
