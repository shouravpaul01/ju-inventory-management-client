import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JULoading from "@/src/components/ui/JULoading";
import { getSingleCategory } from "@/src/hooks/Category";
import { createCategoryReq, updateCategoryReq } from "@/src/services/Category";
import { TErrorMessage } from "@/src/types";
import { categoryValidation } from "@/src/validations/category.validation";
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
import { useQueryClient } from "@tanstack/react-query";
import { useEffect,  useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  categoryId: string;
}
export default function CreateUpdateCategoryFromModal({
  useDisclosure,
  categoryId,
}: IProps) {
  const queryClient = useQueryClient();
  const methods = useForm({ resolver: zodResolver(categoryValidation) });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: category, isLoading: isCategoryLoading } = getSingleCategory(
    categoryId!
  );

  useEffect(() => {
    if (categoryId) {
      methods.reset({ name: category?.name });
    }
  }, [categoryId, category]);
  const handleCreateUpdate: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const res = categoryId
      ? await updateCategoryReq(categoryId, data)
      : await createCategoryReq(data);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["single-category"] });
      toast.success(res?.message);
      !categoryId && methods.reset();
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "categoryError") {
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
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      size="xl"
      classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isCategoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : categoryId ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </ModalHeader>
            {isCategoryLoading ? (
              <JULoading className="h-[300px]" />
            ) : (
              <JUForm onSubmit={handleCreateUpdate} methods={methods}>
                <ModalBody>
                  <JUInput
                    name="name"
                    inputProps={{
                      label: "Name",
                      type: "text",
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" color="primary" isLoading={isLoading}>
                    {categoryId ? "Update" : "Submit"}
                  </Button>
                </ModalFooter>
              </JUForm>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
