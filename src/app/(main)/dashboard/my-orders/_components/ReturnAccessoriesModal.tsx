import JUForm from "@/src/components/form/JUForm";
import JUSelect from "@/src/components/form/JUSelect";
import JULoading from "@/src/components/ui/JULoading";
import { getSingleOrder } from "@/src/hooks/order";
import { returnedAccessoriesCodesReq } from "@/src/services/order";
import { TOrderItem } from "@/src/types";
import { returnedItemSchemValidation } from "@/src/validations/order.validation";
import { Button, ButtonGroup } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@heroui/modal";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { FieldValues, useForm } from "react-hook-form";

export default function ReturnAccessoriesModal({
  useDisclosure,
  orderAccesssories,
}: {
  useDisclosure: UseDisclosureProps | any;
  orderAccesssories: { orderId: string; accessory: TOrderItem };
}) {
  const { orderId, accessory } = orderAccesssories || {};
  const methods = useForm({
    resolver: zodResolver(returnedItemSchemValidation),
  });
  const {
    formState: { errors },
  } = methods;
  console.log(accessory,"retu")
  const loadingState = !accessory ? "loading" : "idle";
  const handleReturnedSubmit = async (index: number, accessory: string) => {
    // setSubmitLoading({ _id: accessory });
    // // Validate only the current row's fields
    // const isValid = await methods.trigger(`items.${index}`);
    // if (isValid) {
    //   const rowData = methods.getValues(`items.${index}`);
    //   const updateReturnedData: any = { accessory };
    //   if (rowData?.returnedAccessoriesCodes && rowData?.returnDeadline) {
    //     updateReturnedData.returnedAccessoriesCodes =
    //       rowData.returnedAccessoriesCodes
    //         ?.split(",")
    //         .map((code: any) => code.trim())
    //         .sort();
    //   }
    //   console.log(updateReturnedData, "after");
    //   const res = await returnedAccessoriesCodesReq(
    //     orderId,
    //     updateReturnedData
    //   );
    //   console.log(res, "res");
    //   if (res?.success) {
    //     queryClient.invalidateQueries({ queryKey: ["single-order"] });
    //     setReturnItem(null);
    //     toast.success(res?.message);
    //   } else if (!res?.success && res?.errorMessages?.length > 0) {
    //     if (res?.errorMessages[0]?.path == "orderError") {
    //       toast.error(res?.errorMessages[0]?.message);
    //     }
    //     res?.errorMessages?.forEach((err: TErrorMessage) => {
    //       methods.setError(err.path, { type: "server", message: err.message });
    //     });
    //   }
    // }
    // setSubmitLoading(null);
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
          <>
            <ModalHeader className="flex flex-col gap-1">
              Return Accessories{" "}
            </ModalHeader>
            <ModalBody>
           { accessory?.providedQuantity>accessory?.returnedQuantity &&  <JUForm methods={methods} onSubmit={() => handleReturnedSubmit}>
                <div className="w-full space-y-2">
                    <div className="space-y-1">
                  <JUSelect
                    options={accessory?.providedAccessoryCodes
                      .sort()
                      .filter(
                        (element) =>
                          !accessory?.returnedAllAccessoriesCodes.includes(
                            element
                          )
                      )
                      .map((element) => ({
                        value: element,
                        label: element,
                      }))}
                    name={`returnedAccessoriesCodes`}
                    selectProps={{
                      className: "max-w-[400px]",
                      selectionMode: "multiple",
                      label: "Return Codes:",
                      labelPlacement: "outside",
                      placeholder: "Select Codes",

                      isClearable: true,
                      classNames: { label: "text-sm" },
                    }}
                  />
                  {errors?.returnedAccessoriesCodes &&
                    (errors as FieldValues)?.returnedAccessoriesCodes && (
                      <p className="text-red-500">
                        {
                          (errors as FieldValues)?.returnedAccessoriesCodes
                            ?.message
                        }
                      </p>
                    )}
                </div>
                <Button type="submit" color="primary" size="sm">Submit</Button>
                </div>
              </JUForm>}
              <Table
        aria-label="Example table with client side pagination"
        shadow="none"
        // bottomContent={
        //   <div className=" w-full ">
        //     <Pagination
        //       showControls
        //       color="primary"
        //       page={page}
        //       total={data?.totalPages || 0}
        //       onChange={(page) => setPage(page)}
        //     />
        //   </div>
        // }
        classNames={{
          wrapper: "min-h-[222px] ",
        }}
        removeWrapper
      >
        <TableHeader>
          <TableColumn key="Return Date" width={300}>
            Return Date
          </TableColumn>
          <TableColumn key="Accessories Code">
            Accessories Code
          </TableColumn>
          
          <TableColumn key="Is Return Recieved" width={240}>
            Is Return Recieved
          </TableColumn>
          
          <TableColumn key="action">Recieved By</TableColumn>
        </TableHeader>
        <TableBody
          items={accessory?.returnedDetails ?? []}
          loadingContent={<JULoading className="h-auto" />}
          loadingState={loadingState}
          emptyContent={<p className="">Data not found.</p>}
        >
          {(item) => (
            <TableRow key={item._id!}>
              <TableCell>
               <div>
                <span className="block">Return Date</span>
                <Chip size="sm">{dayjs(item.returnedAt).format("MMM D, YYYY")}</Chip>
               </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                    <div className="flex gap-1">
                        <span>Returned Qty :</span> <Chip radius="full" color="success">{item.quantity}</Chip>
                    </div>
                    <div>
                        <span>Returned Code: </span>
                    <div className="flex flex-wrap gap-1">
                        {
                        item?.returnedAccessoriesCodes?.map((code,index)=><Chip  key={index} size="sm">{code}</Chip>)
                    } 
                    </div>
                    </div>
                </div>
              </TableCell>
              <TableCell>
                <>
                {item.isReturnReceived && <Chip size="sm" color={item?.isReturnReceived?"success":"danger"}>{item.isReturnReceived?"Recieved":"Not Recieved"}</Chip>}
                </>
              </TableCell>
             <TableCell>
                <></>
             </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
            </ModalBody>
          </>
        )}
        
      </ModalContent>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}
