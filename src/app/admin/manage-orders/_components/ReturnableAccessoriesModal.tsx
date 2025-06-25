"use client";
import JUCheckbox from "@/src/components/form/JUCheckbox";
import JUDatePicker from "@/src/components/form/JUDatePicker";
import JUForm from "@/src/components/form/JUForm";
import JUNumberInput from "@/src/components/form/JUNumberInput";
import JUSelect from "@/src/components/form/JUSelect";
import {
  ArrowRightAltIcon,
  CheckIcon,
  EditIcon,
  ImageIcon,
  InfoIcon,
  MoreHorzIcon,
  XmarkIcon,
} from "@/src/components/icons";
import JULoading from "@/src/components/ui/JULoading";

import {
  returnedAccessoriesReceivedReq,
  updateOrderItemsReq,
} from "@/src/services/order";
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
import { Card, CardBody, CardHeader } from "@heroui/card";
import { CheckboxIcon } from "@heroui/checkbox";

export default function ReturnableAccessoriesModal({
  useDisclosure,
  order,
  isLoading: isOrderLoading,
}: {
  useDisclosure: UseDisclosureProps | any;
  order: TOrder | null;
  isLoading: boolean;
}) {
  const queryClient = useQueryClient();
  const [isSubmitLoading, setSubmitLoading] = useState<any>(null);
  const [editItem, setEditItem] = useState<string | null>(null);

  console.log(order, "ho");
  const handleReturnedReceived = async (
    itemId: string,
    returnedId: string,
    payload: FieldValues
  ) => {
    setSubmitLoading({ _id: returnedId });

    const res = await returnedAccessoriesReceivedReq(
      order?._id!,
      itemId,
      returnedId,
      payload
    );
    console.log(res, "res");
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["single-order"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "orderError") {
        toast.error(res?.errorMessages[0]?.message);
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
            <>
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
                      <TableColumn key="expectedQty" width={180}>
                        Order Qty
                      </TableColumn>
                      <TableColumn key="providedQty" width={400}>
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
                        order.items
                          .filter(
                            (item) =>
                              (item.accessory as TAccessory).isItReturnable ==
                              true
                          )
                          ?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div>
                                    <Avatar
                                      radius="md"
                                      fallback={<ImageIcon />}
                                      className="size-20 text-large"
                                      src={
                                        (item.accessory as TAccessory)?.image
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-bold line-clamp-1">
                                      {(item.accessory as TAccessory)?.name}
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <span>Quantity:</span>
                                      <Chip
                                        size="sm"
                                        color="success"
                                        radius="full"
                                      >
                                        {
                                          (item.accessory as TAccessory)
                                            ?.quantityDetails?.currentQuantity
                                        }
                                      </Chip>
                                    </div>
                                    <Chip
                                      size="sm"
                                      color={
                                        item.isProvided ? "success" : "warning"
                                      }
                                      radius="full"
                                    >
                                      {item.isProvided
                                        ? "Provided"
                                        : "Not Provided"}
                                    </Chip>
                                    <div className="flex items-center gap-1">
                                      <span className="block">Return D:</span>
                                      <Chip key={index} size="sm" radius="full">
                                        {dayjs(item.returnDeadline).format(
                                          "MMM D, YYYY"
                                        )}
                                      </Chip>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex gap-2">
                                    <span>Expected Qty:</span>
                                    <Chip size="sm" color="success">
                                      {item?.expectedQuantity}
                                    </Chip>
                                  </div>
                                  <div className=" flex gap-1">
                                    <span>Provided Qty:</span>

                                    <Chip
                                      size="sm"
                                      color="success"
                                      radius="full"
                                    >
                                      {item?.returnedQuantity || 0}
                                    </Chip>
                                  </div>
                                  <div className=" flex gap-1">
                                    <span>Returned Qty:</span>

                                    <Chip
                                      size="sm"
                                      color={
                                        item?.returnedQuantity ===
                                        item.providedQuantity
                                          ? "success"
                                          : "danger"
                                      }
                                      radius="full"
                                    >
                                      {item?.returnedQuantity || 0}
                                    </Chip>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="h-[200px] overflow-y-scroll">
                                <div className="h-[200px]">
                                  {item?.providedAccessoryCodes?.length > 0 && (
                                    <div>
                                      <div className="flex flex-wrap gap-1">
                                        <label className="block">
                                          Provided Codes:
                                        </label>

                                        <p>
                                          {item?.providedAccessoryCodes
                                            ?.slice(0, 2)
                                            .join(", ")}
                                        </p>
                                        {item?.providedAccessoryCodes?.length >
                                          1 && (
                                          <Tooltip
                                            content={
                                              <div className="flex flex-wrap gap-1">
                                                {item?.providedAccessoryCodes?.join(
                                                  ", "
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
                                      <div className="space-y-2">
                                        {item?.returnedDetails?.length > 0 &&
                                          item?.returnedDetails?.map(
                                            (detail, detailIndex) => (
                                              <Card key={detailIndex}>
                                                <CardHeader className="justify-between border-b">
                                                  <div>
                                                    Returned D:{" "}
                                                    <Chip size="sm">
                                                      {dayjs(
                                                        detail.returnedAt
                                                      ).format("MMM D, YYYY")}
                                                    </Chip>
                                                  </div>
                                                  <div>
                                                    {detail.isReturnReceived ? (
                                                      <Chip
                                                        color="success"
                                                        size="sm"
                                                        radius="full"
                                                        startContent={<CheckIcon className="fill-black" />}
                                                      >
                                                        Received Successfully
                                                      </Chip>
                                                    ) : (
                                                      <Button
                                                        size="sm"
                                                        variant="shadow"
                                                        color="primary"
                                                        isLoading={
                                                          isSubmitLoading?._id ===
                                                          detail._id
                                                        }
                                                        startContent={
                                                          !isSubmitLoading?._id && (
                                                            <ArrowRightAltIcon className="fill-white" />
                                                          )
                                                        }
                                                        onPress={() =>
                                                          handleReturnedReceived(
                                                            (
                                                              item.accessory as TAccessory
                                                            )._id!,
                                                            detail._id!,
                                                            {
                                                              quantity: detail.quantity,
                                                              returnedAccessoriesCodes: detail.returnedAccessoriesCodes
                                                            }
                                                          )
                                                        }
                                                      >
                                                        Return Received
                                                      </Button>
                                                    )}
                                                  </div>
                                                </CardHeader>
                                                <CardBody>
                                                  <div>
                                                    <label className="block">
                                                      Returned Codes:
                                                    </label>
                                                    <div>
                                                      {detail.returnedAccessoriesCodes
                                                        ?.slice(0, 2)
                                                        .join(", ")}
                                                    </div>
                                                  </div>
                                                </CardBody>
                                              </Card>
                                            )
                                          )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
