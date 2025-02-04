import JUDatePicker from "@/src/components/form/JUDatePicker";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUNumberInput from "@/src/components/form/JUNumberInput";
import JUSelect from "@/src/components/form/JUSelect";
import { ImageIcon, InfoIcon } from "@/src/components/icons";
import JULoading from "@/src/components/ui/JULoading";
import { getSingleOrder } from "@/src/hooks/order";
import { TAccessory } from "@/src/types";
import isEventExists from "@/src/utils/isEventExists";
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
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export default function OrderItems({
  useDisclosure,
  orderId,
}: {
  useDisclosure: UseDisclosureProps | any;
  orderId: string;
}) {
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const methods = useForm();
  const { data: order, isLoading: isOrderLoading } = getSingleOrder(orderId);
  const loadingState = isOrderLoading ? "loading" : "idle";
  useEffect(() => {
    if (order) {
      const defaultValues = order.items.map((item) => ({
        accessory: (item.accessory as TAccessory)?._id,
        providedQuantity: item.expectedQuantity,
      }));
      methods.reset({ items: defaultValues });
      console.log(defaultValues, "def");
    }
    if (!useDisclosure.isOpen) {
      methods.reset();
    }
  }, [order, useDisclosure.isOpen]);
  console.log(orderId, order, "order");
  const handleSubmitForm: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
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
          <JUForm methods={methods} onSubmit={handleSubmitForm}>
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
                    <TableColumn key="item" width={280}>
                      Item
                    </TableColumn>
                    <TableColumn key="expectedQty" width={180}>
                      Order Qty
                    </TableColumn>
                    <TableColumn key="providedQty" width={300}>{isEventExists({events:order?.events!,checkEvent:"approved"})?"Provided Qty - Return Deadline":"Approval"}
                      
                    </TableColumn>

                    <TableColumn key="action">Action</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={order?.items ?? []}
                    loadingContent={<JULoading className="h-auto" />}
                    loadingState={loadingState}
                    emptyContent={<p className="">Data not found.</p>}
                  >
                    {(item) => (
                      <TableRow key={(item.accessory as TAccessory)?._id!}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div>
                              <JUInput
                                name={`items.${order?.items.indexOf(item)}.accessory`}
                                inputProps={{ className: "hidden" }}
                              />
                              <Avatar
                                radius="md"
                                fallback={<ImageIcon />}
                                className=" size-20 text-large"
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
                                {(item.accessory as TAccessory)?.isItReturnable
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
                            {
                              isEventExists({events:order?.events!,checkEvent:"approved"}) && <div className="space-y-1">
                              <span>Provided Qty:</span>
                              <JUNumberInput
                                name={`items.${order?.items.indexOf(item)}.providedQuantity`}
                              />
                            </div>
                            }
                            
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {
                            
                            isEventExists({events:order?.events!,checkEvent:"approved"}) ?(item.accessory as TAccessory).isItReturnable  ? (
                              <div className="space-y-1">
                                <JUSelect
                                  options={(
                                    item.accessory as TAccessory
                                  ).codeDetails.currentCodes.map((element) => ({
                                    value: element,
                                    label: element,
                                  }))}
                                  name={`items.${order?.items.indexOf(item)}.providedAccessoryCodes`}
                                  selectProps={{
                                    className:"max-w-[300px]",
                                    selectionMode:"multiple",
                                    label: "Provided Codes:",
                                    labelPlacement: "outside",
                                    placeholder: "Select Codes",
                                    classNames: { label: "text-sm" },
                                  }}
                                />
                                <JUDatePicker
                                  name={`items.${order?.items.indexOf(item)}.returnDeadline`}
                                  inputProps={{
                                    label: "Return Deadline:",
                                    labelPlacement: "outside",
                                    classNames: { label: "text-sm" },
                                  }}
                                />
                              </div>
                            ) : (
                              <p>
                                The order item is non-returnable, so the return
                                deadline and codes will not be provided.
                              </p>
                            ):<Chip color="danger" size="sm">Pending</Chip>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Button color="primary" variant="flat" size="sm" startContent={<InfoIcon/>}>Item Info</Button>
                          </div>
                           </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
            )}
            <ModalFooter>
              {" "}
              <Button type="submit" color="primary" isLoading={isSubmitLoading}>
                Submit
              </Button>
            </ModalFooter>
          </JUForm>
        )}
      </ModalContent>
    </Modal>
  );
}
