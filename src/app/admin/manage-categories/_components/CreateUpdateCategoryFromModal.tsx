import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUSelect from "@/src/components/form/JUSelect";
import JULoading from "@/src/components/ui/JULoading";
import { designationOptions } from "@/src/constents";
import { getSingleCategory } from "@/src/hooks/Category";
import { getSingleUser } from "@/src/hooks/User";
import { createCategoryReq, updateCategoryReq } from "@/src/services/Category";
import { createFacultyReq } from "@/src/services/Faculty";
import { updateUserReq } from "@/src/services/User";
import { TErrorMessage } from "@/src/types";
import { categoryValidation } from "@/src/validations/category.validation";
import { facultyValidation } from "@/src/validations/faculty.validation";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@nextui-org/modal";
import { Skeleton } from "@nextui-org/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<TErrorMessage[]>([]);
  const [isResetForm, setIsResetForm] = useState<boolean>(false);
  const { data: category, isLoading: isCategoryLoading } =
    getSingleCategory(categoryId!);

  const defaultValues = useMemo(() => {
    if (!categoryId) return {};
    return {
      name: category?.name || "",
    };
  }, [categoryId, category]);
  const handleCreateUpdate: SubmitHandler<FieldValues> = async (
    data
  ) => {
    setIsLoading(true);
    const res = categoryId
      ? await updateCategoryReq(categoryId, data)
      : await createCategoryReq(data);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["single-category"] });
      toast.success(res?.message);
      !categoryId && setIsResetForm(true);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "categoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
      setValidationErrors(res?.errorMessages);
    }

    setIsLoading(false);
  };
  console.log(validationErrors);
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
              <JUForm
                onSubmit={handleCreateUpdate}
                validation={categoryValidation}
                errors={validationErrors}
                reset={isResetForm}
                defaultValues={defaultValues}
              >
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
