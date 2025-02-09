import JUCheckbox from "@/src/components/form/JUCheckbox";
import JUDatePicker from "@/src/components/form/JUDatePicker";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUNumberInput from "@/src/components/form/JUNumberInput";
import JUSelect from "@/src/components/form/JUSelect";
import { ImageIcon, InfoIcon } from "@/src/components/icons";
import JULoading from "@/src/components/ui/JULoading";
import { getSingleOrder } from "@/src/hooks/order";
import { updateOrderItemsReq } from "@/src/services/order";
import { TAccessory, TErrorMessage } from "@/src/types";
import isEventExists from "@/src/utils/isEventExists";
import { orderedItemSchemaValidation } from "@/src/validations/order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@nextui-org/modal";
import { Skeleton } from "@nextui-org/skeleton";
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
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function OrderItems({
  useDisclosure,
  orderId,
}: {
  useDisclosure: UseDisclosureProps | any;
  orderId: string;
}) {
  const queryClient = useQueryClient();
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const methods = useForm({
    resolver: zodResolver(orderedItemSchemaValidation),
  });
  const { data: order, isLoading: isOrderLoading } = getSingleOrder(orderId);

  const { errors } = methods.formState;
  useEffect(() => {
    if (order) {
      const defaultValues = order.items.map((item) => ({
        accessory: (item.accessory as TAccessory)?._id,
        isItReturnable: (item.accessory as TAccessory)?.isItReturnable,
        expectedQuantity: item.expectedQuantity,
        currentQuantity: (item.accessory as TAccessory)?.quantityDetails
          ?.currentQuantity,
        providedQuantity: item.expectedQuantity,
        isProvided: item.isProvided,
      }));
      methods.reset({ items: defaultValues });
    }
    if (!useDisclosure.isOpen) {
      methods.reset();
    }
  }, [order]);

  const handleRowSubmit = async (index: number) => {
    setSubmitLoading(true);

    // Validate only the current row's fields
    const isValid = await methods.trigger(`items.${index}`);

    if (isValid) {
      const rowData = methods.getValues(`items.${index}`);
      console.log(rowData,"p")
      // const res = await updateOrderItemsReq(order?._id!, [rowData]);

      // if (res?.success) {
      //   queryClient.invalidateQueries({ queryKey: ["single-order"] });
      //   toast.success(res?.message);
      // } else if (!res?.success && res?.errorMessages?.length > 0) {
      //   if (res?.errorMessages[0]?.path == "orderError") {
      //     toast.error(res?.errorMessages[0]?.message);
      //   }

      //   res?.errorMessages?.forEach((err: TErrorMessage) => {
      //     methods.setError(err.path, { type: "server", message: err.message });
      //   });
      // }
    }

    setSubmitLoading(false);
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
                "Order Items"
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
                            <JUCheckbox name={`items.${index}.isProvided`} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div>
                                <JUInput
                                  name={`items.${index}.accessory`}
                                  inputProps={{ className: "hidden" }}
                                />
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
                                  <span>Provided Qty:</span>
                                  <JUNumberInput
                                    name={`items.${index}.providedQuantity`}
                                  />
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
                              }) ? (
                                (item.accessory as TAccessory)
                                  .isItReturnable ? (
                                  <div className="space-y-1">
                                    <JUSelect
                                      options={(
                                        item.accessory as TAccessory
                                      ).codeDetails.currentCodes.map(
                                        (element) => ({
                                          value: element,
                                          label: element,
                                        })
                                      )}
                                      name={`items.${index}.providedAccessoryCodes`}
                                      selectProps={{
                                        className: "max-w-[300px]",
                                        selectionMode: "multiple",
                                        label: "Provided Codes:",
                                        labelPlacement: "outside",
                                        placeholder: "Select Codes",
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
                                )
                              ) : (
                                <Chip color="danger" size="sm">
                                  Pending
                                </Chip>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                color="primary"
                                size="sm"
                                isLoading={isSubmitLoading}
                                onPress={() => handleRowSubmit(index)}
                              >
                                Submit
                              </Button>
                              <Button
                                color="primary"
                                variant="flat"
                                size="sm"
                                startContent={<InfoIcon />}
                              >
                                Item Info
                              </Button>
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