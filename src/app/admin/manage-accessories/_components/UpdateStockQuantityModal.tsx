import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import { updateStockQuantity } from "@/src/services/Accessory";
import { updateStockQuantityValidation } from "@/src/validations/accessory.validation";
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
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  accessoryId?: string;
}
export default function UpdateStockQuantityModal({
  useDisclosure,
  accessoryId,
}: IProps) {
  const queryClient = useQueryClient();
  const methods = useForm({
    resolver: zodResolver(updateStockQuantityValidation),
  });
  useEffect(() => {
    if (accessoryId) {
      methods.reset({ _id: accessoryId });
    }
  }, [accessoryId]);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const handleUpdateStockQuantity: SubmitHandler<FieldValues> = async (
    data
  ) => {
    setIsSubmitLoading(true);
    const res = await updateStockQuantity(data);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      toast.success(res?.message);
      useDisclosure.onClose();
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "accessoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
    setIsSubmitLoading(false);
  };
  return (
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      isDismissable={false}
      size="sm"
      classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Update Stock
            </ModalHeader>
            <JUForm methods={methods} onSubmit={handleUpdateStockQuantity}>
              {" "}
              <ModalBody>
                <JUInput
                  name="_id"
                  inputProps={{
                    type: "text",
                    className: "w-full hidden",
                  }}
                />
                <JUInput
                  name="quantity"
                  inputProps={{
                    label: "Quantity",
                    type: "number",
                    className: "w-full ",
                  }}
                  registerOptions={{ valueAsNumber: true }}
                />
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="primary" isLoading={isSubmitLoading}>
                  Stock Update
                </Button>
              </ModalFooter>
            </JUForm>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
