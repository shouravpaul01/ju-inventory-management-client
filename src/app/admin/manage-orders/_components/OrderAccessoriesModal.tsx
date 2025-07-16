"use client";
import JUCheckbox from "@/src/components/form/JUCheckbox";
import JUDatePicker from "@/src/components/form/JUDatePicker";
import JUForm from "@/src/components/form/JUForm";
import JUNumberInput from "@/src/components/form/JUNumberInput";
import JUSelect from "@/src/components/form/JUSelect";
import {
  EditIcon,
  ImageIcon,
  InfoIcon,
  MoreHorzIcon,

  XmarkIcon,
} from "@/src/components/icons";
import JULoading from "@/src/components/ui/JULoading";

import { updateOrderItemsReq } from "@/src/services/order";
import { TAccessory, TErrorMessage, TOrder } from "@/src/types";
import isEventExists from "@/src/utils/isEventExists";
import { orderedItemSchemaValidation } from "@/src/validations/order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
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
import { Tooltip } from "@heroui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseDate } from "@internationalized/date";


export default function OrderAccessoriesModal({
  useDisclosure,
  order,
  isLoading: isOrderLoading,
}: {
  useDisclosure: UseDisclosureProps | any;
  order: TOrder | null;
  isLoading:boolean
}) {
  const queryClient = useQueryClient();
  const [isSubmitLoading, setSubmitLoading] = useState<any>(null);
  const [editItem, setEditItem] = useState<string | null>(null);
  
  const methods = useForm({
    resolver: zodResolver(orderedItemSchemaValidation),
  });
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
      setEditItem(null);
    }
  }, [order, useDisclosure]);
  console.log(order, "ho");
  const handleSubmit = async (index: number, itemId: string) => {
    setSubmitLoading({ _id: itemId });

    // Validate only the current row's fields
    const isValid = await methods.trigger(`items.${index}`);

    if (isValid) {
      const rowData = methods.getValues(`items.${index}`);
      console.log(rowData, "before");
      if (rowData?.providedAccessoryCodes.length>0 && rowData?.returnDeadline) {
        rowData.providedAccessoryCodes = rowData?.providedAccessoryCodes
          ?.split(",")
          .map((code: any) => code.trim())
          .sort();
        rowData.returnDeadline = dayjs(rowData.returnDeadline).format(
          "MMM D, YYYY"
        );
      }
      console.log(rowData, "after");
      const res = await updateOrderItemsReq(order?._id!, itemId, rowData);
      console.log(res, "res");
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["single-order"] });
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
    <>
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
                "Order Accessories"
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
                    <TableColumn key="isProvided">
                      <></>
                    </TableColumn>
                    <TableColumn key="item" width={280}>
                      Item
                    </TableColumn>
                    <TableColumn key="expectedQty" width={180}>
                      Order Qty
                    </TableColumn>
                    <TableColumn key="providedQty" width={300}>
                      {isEventExists({
                        events: order?.events!,
                        checkEvent: "approved",
                      })
                        ? "Provided Qty - Return Deadline"
                        : "Approval"}
                    </TableColumn>
                    <TableColumn key="action">Action</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {order?.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {isEventExists({
                              events: order?.events!,
                              checkEvent: "approved",
                            }) && (
                              <Tooltip
                                content={
                                  item.isProvided ? "Already provided." : ""
                                }
                              >
                                <JUCheckbox
                                  name={`items.${index}.isProvided`}
                                  checkboxProps={{
                                    isReadOnly: item.isProvided,
                                    defaultSelected: item.isProvided,
                                  }}
                                />
                              </Tooltip>
                            )}
                          </TableCell>
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
                              <div className="space-y-1">
                                <p className="font-bold line-clamp-1">
                                  {(item.accessory as TAccessory)?.name}
                                </p>
                                <div className="flex items-center gap-1">
                                  <span>Quantity:</span>
                                  <Chip size="sm" color="success" radius="full">
                                    {
                                      (item.accessory as TAccessory)
                                        ?.quantityDetails?.currentQuantity
                                    }
                                  </Chip>
                                </div>
                                <Chip size="sm" color="warning">
                                  {(item.accessory as TAccessory)
                                    ?.isItReturnable
                                    ? "Returnable"
                                    : "Non-returnable"}
                                </Chip>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="flex gap-2">
                                <span>Expected Qty:</span>
                                <Chip size="sm" color="success">
                                  {item?.expectedQuantity}
                                </Chip>
                              </div>
                              {isEventExists({
                                events: order?.events!,
                                checkEvent: "approved",
                              }) && (
                                <div className="space-y-1">
                                  {item?.providedQuantity &&
                                    editItem !==
                                      (item.accessory as TAccessory)._id && (
                                      <div className=" flex gap-1">
                                        <span>Provided Qty:</span>

                                        <Chip
                                          size="sm"
                                          color="success"
                                          radius="full"
                                        >
                                          {item?.providedQuantity || 0}
                                        </Chip>
                                      </div>
                                    )}
                                  {(!item.isProvided ||
                                    editItem ==
                                      (item.accessory as TAccessory)._id) &&
                                    watch(`items.${index}.isProvided`) && (
                                      <div>
                                        <span>Provided Qty:</span>
                                        <JUNumberInput
                                          name={`items.${index}.providedQuantity`}
                                        />
                                      </div>
                                    )}

                                  {errors?.items &&
                                    (errors as FieldValues)?.items[index]
                                      ?.providedQuantity && (
                                      <p className="text-red-500">
                                        {
                                          (errors as FieldValues)?.items[index]
                                            ?.providedQuantity?.message
                                        }
                                      </p>
                                    )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {isEventExists({
                                events: order?.events!,
                                checkEvent: "approved",
                              }) &&
                                (!item.isProvided ||
                                  editItem ==
                                    (item.accessory as TAccessory)._id) &&
                                watch(`items.${index}.isProvided`) &&
                                ((item.accessory as TAccessory)
                                  .isItReturnable ? (
                                  <div className="space-y-1">
                                    <JUSelect
                                      options={[
                                        ...(item.accessory as TAccessory)
                                          .codeDetails.currentCodes,
                                        ...item?.providedAccessoryCodes,
                                      ]
                                        .sort()
                                        .map((element) => ({
                                          value: element,
                                          label: element,
                                        }))}
                                      name={`items.${index}.providedAccessoryCodes`}
                                      selectProps={{
                                        className: "max-w-[300px]",
                                        selectionMode: "multiple",
                                        label: "Provided Codes:",
                                        labelPlacement: "outside",
                                        placeholder: "Select Codes",

                                        defaultSelectedKeys: [
                                          ...item?.providedAccessoryCodes,
                                        ],
                                        isDisabled:
                                          methods.watch(
                                            `items.${index}.isProvided`
                                          ) == false,
                                        classNames: { label: "text-sm" },
                                      }}
                                    />
                                    {errors?.items &&
                                      (errors as FieldValues)?.items[index]
                                        ?.providedAccessoryCodes && (
                                        <p className="text-red-500">
                                          {
                                            (errors as FieldValues)?.items[
                                              index
                                            ]?.providedAccessoryCodes?.message
                                          }
                                        </p>
                                      )}
                                    <JUDatePicker
                                      name={`items.${index}.returnDeadline`}
                                      inputProps={{
                                        label: "Return Deadline:",
                                        labelPlacement: "outside",
                                        variant: "bordered",

                                        isDisabled:
                                          methods.watch(
                                            `items.${index}.isProvided`
                                          ) == false,
                                        classNames: { label: "text-sm" },
                                      }}
                                    />
                                    {errors?.items &&
                                      (errors as FieldValues)?.items[index]
                                        ?.returnDeadline && (
                                        <p className="text-red-500">
                                          {
                                            (errors as FieldValues)?.items[
                                              index
                                            ]?.returnDeadline?.message
                                          }
                                        </p>
                                      )}
                                  </div>
                                ) : (
                                  <p className="text-slate-600">
                                    The order item is non-returnable, so the
                                    return deadline and codes will not be
                                    provided.
                                  </p>
                                ))}
                              {item?.providedAccessoryCodes?.length > 0 &&
                                editItem !==
                                  (item.accessory as TAccessory)._id && (
                                  <div>
                                    <div className="space-y-1">
                                      <span className="block">
                                        Provided Codes:
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                        {item?.providedAccessoryCodes
                                          ?.slice(0, 2)
                                          ?.map((code, index) => (
                                            <Chip
                                              key={index}
                                              size="sm"
                                              color="success"
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
                                    <div className="flex items-center gap-1">
                                      <span className="block">
                                        Return DeadLine:
                                      </span>
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
                                  </div>
                                )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {!item.isProvided ||
                              editItem == (item.accessory as TAccessory)._id ? (
                                <Button
                                  color="primary"
                                  size="sm"
                                  isDisabled={
                                    watch(`items.${index}.isProvided`) == false
                                  }
                                  isLoading={
                                    isSubmitLoading?._id ===
                                    (item.accessory as TAccessory)?._id!
                                  }
                                  onPress={() =>
                                    handleSubmit(
                                      index,
                                      (item.accessory as TAccessory)._id!
                                    )
                                  }
                                >
                                  {item.isProvided ? "Update" : "Submit"}
                                </Button>
                              ) : (
                                <Button
                                  color="primary"
                                  variant="flat"
                                  size="sm"
                                  startContent={<EditIcon />}
                                  onPress={() =>
                                    setEditItem(
                                      (item.accessory as TAccessory)._id!
                                    )
                                  }
                                >
                                  Edit
                                </Button>
                              )}
                              <Button
                                color="primary"
                                variant="flat"
                                size="sm"
                                startContent={<InfoIcon />}
                              >
                                Item Info
                              </Button>
                              {editItem ==
                                (item.accessory as TAccessory)._id && (
                                <Button
                                  color="default"
                                  variant="flat"
                                  size="sm"
                                  className="hover:secondary"
                                  startContent={<XmarkIcon />}
                                  onPress={() => {
                                    setEditItem(null);

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
            
          </JUForm>
        )}
      </ModalContent>
    </Modal>
   
    </>
  );
}
