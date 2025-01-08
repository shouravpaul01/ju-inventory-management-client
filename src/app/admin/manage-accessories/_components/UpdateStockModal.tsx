import JUFileInput from "@/src/components/form/JUFileInput";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUTextEditor from "@/src/components/form/JUTextEditor";
import PreviewImage from "@/src/components/ui/PreviewImage";
import { createStock } from "@/src/services/Stock";
import { TErrorMessage } from "@/src/types";
import { updateStockQuantityValidation } from "@/src/validations/stock.validation";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@nextui-org/modal";
import { image } from "@nextui-org/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  stockId?: string;
}
export default function UpdateStockModal({ useDisclosure, stockId }: IProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<TErrorMessage[]>([]);
  useEffect(() => {
    if (!useDisclosure.isOpen) {
      setPreviewUrls([]);
    }
  }, [useDisclosure.isOpen]);
  console.log(stockId, "stockId");
  const handleUpdateStock: SubmitHandler<FieldValues> = async (data) => {
    console.log(data.images);
    const formData = new FormData();
    Array.from(data.images).forEach((image: any) => {
      formData.append("images", image);
    });

    delete data["images"];
    formData.append("data", JSON.stringify(data));
    const res = await createStock({ stockId, data: formData });
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success(res?.message);
      // !accessoryId && setIsResetForm(true);
      useDisclosure.onClose();
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "accessoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
      setValidationErrors(res?.errorMessages);
    }
    console.log(res, "data");
  };
  return (
    <div>
      <Modal
        isOpen={useDisclosure.isOpen}
        onOpenChange={useDisclosure.onOpenChange}
        isDismissable={false}
        size="3xl"
        classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Stock
              </ModalHeader>
              <JUForm
                onSubmit={handleUpdateStock}
                validation={updateStockQuantityValidation}
                errors={validationErrors}
              >
                <ModalBody>
                  <JUInput
                    name="quantity"
                    inputProps={{
                      label: "Quantity",
                      type: "number",
                      className: "w-full md:w-[40%]",
                    }}
                    registerOptions={{ valueAsNumber: true }}
                  />
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-[66%]">
                      <JUFileInput
                        name="images"
                        onPreview={(previews) => setPreviewUrls(previews)}
                        multiple
                      />
                    </div>
                  </div>
                  {previewUrls?.length > 0 && (
                    <PreviewImage previews={previewUrls} />
                  )}
                  <JUTextEditor name="description" label="Description" />
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" color="primary" isLoading={isLoading}>
                    Update
                  </Button>
                </ModalFooter>
              </JUForm>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
