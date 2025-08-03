import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUSelect from "@/src/components/form/JUSelect";
import JULoading from "@/src/components/ui/JULoading";
import { getAllCategories } from "@/src/hooks/Category";
import { getSingleSubCategory } from "@/src/hooks/Sub Category";
import {
  createSubCategoryReq,
  updateSubCategoryReq,
} from "@/src/services/Sub Category";
import { TErrorMessage, TSelectOption } from "@/src/types";
import { subCategoryValidation } from "@/src/validations/subCategory.validation";
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
import { useEffect, useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import JUTextEditor from "@/src/components/form/JUTextEditor";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  subCategoryId: string;
}
export default function CreateUpdateSubCategoryFromModal({
  useDisclosure,
  subCategoryId,
}: IProps) {
  const queryClient = useQueryClient();
  const methods = useForm({ resolver: zodResolver(subCategoryValidation) });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: subCategory, isLoading: isSubCategoryLoading } =
    getSingleSubCategory(subCategoryId!);
  useEffect(() => {
    if (subCategoryId) {
      methods.reset({
        category: subCategory?.category?._id,
        name: subCategory?.name,
        description:subCategory?.description
      });
    }else{
      methods.reset({
        category: "",
        name:"",
        description:""
      })
      
    }
  }, [subCategoryId, subCategory,useDisclosure.isOpen]);
  const { data: allActiveCategories } = getAllCategories({
    query: [
      { name: "isActive", value: true },
      { name: "isApproved", value: true },
    ],
  });

  const activeCategoriesOptions = useMemo(() => {
    return allActiveCategories?.data?.map((category) => ({
      label: category.name,
      value: category._id,
    }));
  }, [allActiveCategories]);
 
  const handleCreateUpdate: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
    const res = subCategoryId
      ? await updateSubCategoryReq(subCategoryId, data)
      : await createSubCategoryReq(data);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      queryClient.invalidateQueries({ queryKey: ["single-subcategory"] });
      toast.success(res?.message);
      !subCategoryId && methods.reset();
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "subCategoryError") {
        toast.error(res?.errorMessages[0]?.message);
        return;
      }

      res?.errorMessages?.forEach((err: TErrorMessage) => {
        methods.setError(err.path, { type: "server", message: err.message });
      });
    }

    
    } catch (error) {
      console.error("Room operation failed:", error);
      toast.error("An unexpected error occurred");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      size="2xl"
      classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isSubCategoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : subCategoryId ? (
                "Update Sub Category"
              ) : (
                "Create Sub Category"
              )}
            </ModalHeader>
            {isSubCategoryLoading ? (
              <JULoading className="h-[300px]" />
            ) : (
              <JUForm onSubmit={handleCreateUpdate} methods={methods}>
                <ModalBody>
                  <div className="flex flex-col md:flex-row gap-5">
                    <JUSelect
                      name="category"
                    
                      options={activeCategoriesOptions as TSelectOption[]}
                      selectProps={{
                        isRequired:true,
                        label: "Category",
                        placeholder: "Select Category",
                        className: "w-full md:w-[40%]",
                        defaultSelectedKeys:subCategoryId?[subCategory?.category?._id]:[]
                      }}
                    />
                    <JUInput
                      name="name"
                      inputProps={{
                        isRequired:true,
                        label: "Name",
                        type: "text",
                        className: "w-full md:w-[60%]",
                      }}
                    />
                  
                  </div>
                  <JUTextEditor name="description" label="Description" className="h-40 mb-16"/>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" color="primary" isLoading={isLoading}>
                    {subCategoryId ? "Update" : "Submit"}
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
