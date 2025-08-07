import JUFileInput from "@/src/components/form/JUFileInput";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUTextEditor from "@/src/components/form/JUTextEditor";
import JULoading from "@/src/components/ui/JULoading";
import PreviewImage from "@/src/components/ui/PreviewImage";
import { getSingleStock } from "@/src/hooks/Stock";
import { createStock, updateStockReq } from "@/src/services/Stock";
import { TErrorMessage, TSelectOption } from "@/src/types";
import { updateStockQuantityValidation } from "@/src/validations/stock.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { image } from "@heroui/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import JUSelect from "@/src/components/form/JUSelect";
import { getAllRooms } from "@/src/hooks/Room";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  stockId?: string;
  stockDetailsId?: string;
}
export default function UpdateStockModal({
  useDisclosure,
  stockId,
  stockDetailsId,
}: IProps) {
  const queryClient = useQueryClient();
  const methods = useForm({
    resolver: zodResolver(updateStockQuantityValidation),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentImages, setPreviewDocumentImages] = useState<string[]>([]);
  const [locatedImages, setPreviewLocatedImages] = useState<string[]>([]);
  const { data: rooms } = getAllRooms({
    query: [{ name: "isActive", value: true }],
  });
  const roomOptions = useMemo(() => {
    return rooms?.data?.map((room) => ({
      label: room?.roomNo,
      value: room?._id,
    }));
  }, [rooms]);
  useEffect(() => {
    if (!useDisclosure.isOpen) {
      methods.reset();
      setPreviewDocumentImages([]);
    }
  }, [useDisclosure.isOpen]);
  const { data: stock, isLoading: isStockLoading } = getSingleStock(
    stockId!,
    stockDetailsId!
  );
  console.log(stock, "stock");

  useEffect(() => {
    if (stockDetailsId) {
      methods.reset({
        quantity: stock?.quantity,
        description: stock?.description,
      });
      stock?.documentImages?.length! > 0 &&
        setPreviewDocumentImages(stock?.documentImages!);
    }
  }, [stockDetailsId, stock]);
  const handleUpdateStock: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    Array.from(data.images).forEach((image: any) => {
      formData.append("images", image);
    });

    delete data["images"];
    formData.append("data", JSON.stringify(data));
    const updateData = {
      stockId,
      stockDetailsId,
      data: formData,
    };
    const res = stockDetailsId
      ? await updateStockReq(updateData)
      : await createStock({ stockId, data: formData });

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });

      toast.success(res?.message);

      useDisclosure.onClose();
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "accessoryError") {
        toast.error(res?.errorMessages[0]?.message);
        return;
      }
      res?.errorMessages?.forEach((err: TErrorMessage) => {
        methods.setError(err.path, { type: "server", message: err.message });
      });
    }
    setIsLoading(false);
  };
  return (
    <div>
      <Modal
        isOpen={useDisclosure.isOpen}
        onOpenChange={useDisclosure.onOpenChange}
        scrollBehavior="inside"
        size="3xl"
        classNames={{ closeButton: "bg-violet-100 hover:bg-red-200", }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isStockLoading ? (
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                ) : stockDetailsId ? (
                  "Update Stock"
                ) : (
                  "Create Stock"
                )}
              </ModalHeader>
              {isStockLoading ? (
                <JULoading className="h-[300px]" />
              ) : (
                <JUForm onSubmit={handleUpdateStock} methods={methods}>
                  <ModalBody className="relative">
                    <div>
                      <JUInput
                        name="quantity"
                        inputProps={{
                          label: "Quantity",
                          type: "number",
                          className: "w-full md:w-[40%]",
                        }}
                        registerOptions={{ valueAsNumber: true }}
                      />
                      <div className="w-full md:w-[6o%]">
                        <JUFileInput
                          name="documentImages"
                          labelName="Document Images"
                          onPreview={(previews) =>
                            setPreviewDocumentImages(previews)
                          }
                          multiple
                        />
                      </div>
                    </div>

                    {documentImages?.length > 0 && (
                      <PreviewImage
                        previews={documentImages}
                        heading="Preview Document Images"
                      />
                    )}
                    <div className="border border-dashed rounded-md p-2">
                      <h3 className="text-lg border-b border-dashed pb-1 mb-2">Located Details</h3>
                      <div className="flex flex-col md:flex-row gap-2">
                        <JUSelect
                          name="roomNo"
                          options={roomOptions as TSelectOption[]}
                          selectProps={{
                            label: "Select Room",
                            className: "w-full md:w-[40%]",
                          }}
                        />
                        <JUInput
                          name="locatedDetails.place"
                          inputProps={{
                            label: "Place",
                            className: "w-full md:w-[60%]",
                          }}
                        />
                      </div>
                      
                        <JUFileInput
                          name="locatedImages"
                          labelName="Located Images"
                          onPreview={(previews) =>
                            setPreviewLocatedImages(previews)
                          }
                          multiple
                        />
                    

                     <div className="block">
                     {locatedImages?.length > 0 && (
                        <PreviewImage
                          previews={locatedImages}
                          heading="Located Images"
                        />
                      )}
                     </div>
                    </div>
                    <div>
                      <JUTextEditor
                        name="description"
                        label="Description"
                        className="h-28"
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter >
                    <Button type="submit" color="primary" isLoading={isLoading}>
                      {stockDetailsId ? "Update" : "Submit"}
                    </Button>
                  </ModalFooter>
                </JUForm>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
