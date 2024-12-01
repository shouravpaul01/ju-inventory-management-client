import JUFileInput from "@/src/components/form/JUFileInput";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUSelect from "@/src/components/form/JUSelect";
import JUTextEditor from "@/src/components/form/JUTextEditor";
import JULoading from "@/src/components/ui/JULoading";
import { returnableOptions } from "@/src/constents";
import { getAllCategories } from "@/src/hooks/Category";
import {
  getAllActiveSubCatgoriesByCategory,
  getAllSubCategories,
  getSingleSubCategory,
} from "@/src/hooks/Sub Category";
import { createAccessoryReq } from "@/src/services/Accessory";
import {
  createSubCategoryReq,
  updateSubCategoryReq,
} from "@/src/services/Sub Category";
import { TErrorMessage } from "@/src/types";
import { accessoryValidation } from "@/src/validations/accessory.validation";
import { subCategoryValidation } from "@/src/validations/subCategory.validation";
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
  subCategoryId?: string;
}
export default function CreateUpdateAccessoryFromModal({
  useDisclosure,
  subCategoryId,
}: IProps) {
  const queryClient = useQueryClient();
  const [selectCategoryId, setSelectCategoryId] = useState<string | null>(null);
  const [selectSubCategoryId, setSelectSubCategoryId] = useState<string | null>(
    null
  );
  const [accessoryId, setAccessoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [validationErrors, setValidationErrors] = useState<TErrorMessage[]>([]);
  const [isResetForm, setIsResetForm] = useState<boolean>(false);
  const { data: allActiveCategories, isLoading: isCatLoading } =
    getAllCategories({
      query: [
        { name: "isActive", value: true },
        { name: "isApproved", value: true },
      ],
    });
  const { data: allActiveSubCategories, isLoading: isActiveSubCatLoading } =
    getAllActiveSubCatgoriesByCategory(selectCategoryId!);
  const { data: singleSubCategory, isLoading: isSubCatLoading } =
    getSingleSubCategory(selectSubCategoryId!);

  const activeCategoriesOptions = useMemo(() => {
    return allActiveCategories?.data?.map((category) => ({
      label: category.name,
      value: category._id,
    }));
  }, [allActiveCategories]);
  const activeSubCategoriesOptions = useMemo(() => {
    return allActiveSubCategories?.map((subCategory) => ({
      label: subCategory.name,
      value: subCategory._id,
    }));
  }, [allActiveSubCategories]);
  const generateCodeTitle = useMemo(() => {
    const code = singleSubCategory?.name?.substring(0, 4).toUpperCase();
    return singleSubCategory ? `CSE-${code}-` : "";
  }, [selectSubCategoryId, isSubCatLoading]);
  // const defaultValues = useMemo(() => {
  //   if (!subCategoryId) return {};
  //   return {
  //     name: subCategory?.name || "",
  //     category:subCategory?.category._id
  //   };
  // }, [subCategoryId, subCategory]);
  const handleSelectCategory = (value: string) => {
    setSelectCategoryId(value);
  };
  const handleSelectSubCategory = (value: string) => {
    setSelectSubCategoryId(value);
  };
  const handleCreateUpdate: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    setIsLoading(true);
    const formData=new FormData()
    formData.append("file",data.image)
    delete data["image"]
    formData.append("data",JSON.stringify(data))
    const res = accessoryId
      ? await updateSubCategoryReq(accessoryId, data)
      : await createAccessoryReq(formData);
console.log(res)
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      queryClient.invalidateQueries({ queryKey: ["single-subcategory"] });
      toast.success(res?.message);
      !subCategoryId && setIsResetForm(true);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "subCategoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
      setValidationErrors(res?.errorMessages);
    }

    setIsLoading(false);
  };

  const isSubCategoryLoading = false;
  console.log(
    selectCategoryId,
    activeSubCategoriesOptions,
    allActiveSubCategories
  );
  return (
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      isDismissable={false}
      size="4xl"
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
                "Update Accessory"
              ) : (
                "Create Accessory"
              )}
            </ModalHeader>
            {isSubCategoryLoading ? (
              <JULoading className="h-[300px]" />
            ) : (
              <JUForm
                onSubmit={handleCreateUpdate}
                validation={accessoryValidation}
                errors={validationErrors}
                defaultValues={{ codeTitle: generateCodeTitle }}
                reset={isResetForm}
              >
                <ModalBody>
                  <div className="flex flex-col md:flex-row gap-5">
                    <JUSelect
                      name="category"
                      options={activeCategoriesOptions!}
                      selectProps={{
                        label: "Category",
                        placeholder: isCatLoading
                          ? "Loading.."
                          : "Select Category",
                        selectionMode: "single",
                        isDisabled: isCatLoading,
                        className: "w-full md:w-[33%]",
                      }}
                      onChange={handleSelectCategory}
                    />
                    <JUSelect
                      name="subCategory"
                      options={activeSubCategoriesOptions!}
                      selectProps={{
                        label: "Sub Category",
                        placeholder: isActiveSubCatLoading
                          ? "Loading.."
                          : "Select Sub Category",
                        isDisabled: isActiveSubCatLoading,
                        className: "w-full md:w-[33%]",
                      }}
                      onChange={handleSelectSubCategory}
                    />
                    <JUSelect
                      name="isItReturnable"
                      options={returnableOptions!}
                      selectProps={{
                        label: "Returnable",
                        placeholder:
                          "Select whether the accessory is returnable.",
                        className: "w-full md:w-[33%]",
                      }}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-5 ">
                    <JUInput
                      name="name"
                      inputProps={{
                        label: "Name",
                        type: "text",
                        className: "w-full md:w-[66%]",
                      }}
                    />
                    <JUInput
                      name="codeTitle"
                      inputProps={{
                        label: "Code Title",
                        type: "text",
                        className: "w-full md:w-[33%] ",
                        classNames: { input: "uppercase p-0 mb-[2px] f" },
                        startContent: (
                          <div className="pointer-events-none w-36 ">
                            {generateCodeTitle}
                          </div>
                        ),
                      }}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-[66%]">
                      <JUFileInput name="image" />
                    </div>
                    <JUInput
                      name="quantity"
                      inputProps={{
                        label: "Quantity",
                        type: "number",
                        className: "w-full md:w-[33%]",
                      }}
                      registerOptions={{ valueAsNumber: true }}
                    />
                  </div>
                  <JUTextEditor name="description" label="Description" />
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
