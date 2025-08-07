"use client";
import JUFileInput from "@/src/components/form/JUFileInput";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUSelect from "@/src/components/form/JUSelect";
import JUTextEditor from "@/src/components/form/JUTextEditor";
import JULoading from "@/src/components/ui/JULoading";
import PreviewImage from "@/src/components/ui/PreviewImage";
import { returnableOptions } from "@/src/constents";
import { getSingleAccessory } from "@/src/hooks/Accessory";
import { getAllCategories } from "@/src/hooks/Category";
import {
  getAllActiveSubCatgoriesByCategory,
  getSingleSubCategory,
} from "@/src/hooks/Sub Category";
import {
  createAccessoryReq,
  updateAccessoryReq,
} from "@/src/services/Accessory";

import {
  TCategory,
  TErrorMessage,
  TSelectOption,
  TSubCategory,
} from "@/src/types";
import { accessoryValidation } from "@/src/validations/accessory.validation";
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

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  accessoryId?: string;
}
export default function CreateUpdateAccessoryFromModal({
  useDisclosure,
  accessoryId,
}: IProps) {
  const queryClient = useQueryClient();
  const methods = useForm({ resolver: zodResolver(accessoryValidation) });

  const selectCategoryId = methods.watch("category");
  const selectSubCategoryId = methods.watch("subCategory");
  const selectedIsItReturnable = methods.watch("isItReturnable");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [storedImages, setStoredImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: allActiveCategories, isLoading: isCatLoading } =
    getAllCategories({
      query: [
        { name: "isActive", value: true },
        { name: "isApproved", value: true },
      ],
    });
  const { data: allActiveSubCategories, isLoading: isActiveSubCatLoading } =
    getAllActiveSubCatgoriesByCategory(selectCategoryId!);
  const { data: singleSubCategory, isLoading: isSingleCategoryLoading } =
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
    if (!selectSubCategoryId || selectedIsItReturnable == "false") return "";
    const code = singleSubCategory?.name?.substring(0, 4).toUpperCase();
    return singleSubCategory ? `CSE-${code}-` : "Loading...";
  }, [selectSubCategoryId, isSingleCategoryLoading, selectedIsItReturnable]);

  const { data: accessory, isLoading: isAccessoryLoading } = getSingleAccessory(
    accessoryId!
  );
  console.log(accessory, "access");
  // useEffect(() => {
  //   if (!useDisclosure.isOpen) {
  //     methods.reset();
  //   }
  //   if (selectedIsItReturnable == "false") {
  //     methods.clearErrors("codeTitle");
  //   }
  // }, [!useDisclosure.isOpen, selectedIsItReturnable]);

  useEffect(() => {
    if (accessoryId && accessory) {
      methods.reset({
        name: accessory.name,
        category: (accessory.category as TCategory)?._id,
        subCategory: (accessory.subCategory as TSubCategory)?._id,
        codeTitle: accessory.codeTitle.split("-")[2],
        isItReturnable: accessory.isItReturnable,
        description: accessory.description,
      });
      setStoredImages([accessory.image!]);
    } else {
      {
        methods.reset({
          name: "",
          category: "",
          subCategory: "",
          codeTitle: "",
          isItReturnable: "",
          description: "",
        });
        setPreviewUrls([]);
        setStoredImages([]);
      }
    }
  }, [accessoryId, accessory]);
  const handleCreateUpdate: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      data?.image && formData.append("file", data?.image[0]);
      delete data["image"];
      formData.append("data", JSON.stringify(data));
      const updateData = {
        accessoryId,
        data: formData,
      };
      const res = accessoryId
        ? await updateAccessoryReq(updateData)
        : await createAccessoryReq(formData);
      console.log(res, "res");
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["accessories"] });
        queryClient.invalidateQueries({ queryKey: ["single-accessory"] });
        toast.success(res?.message);
        !accessoryId && (methods.reset(), setPreviewUrls([]));
        accessoryId && useDisclosure.onClose();
      } else if (!res?.success && res?.errorMessages?.length > 0) {
        if (res?.errorMessages[0]?.path == "accessoryError") {
          toast.error(res?.errorMessages[0]?.message);
        }

        res?.errorMessages?.forEach((err: TErrorMessage) => {
          methods.setError(err.path, { type: "server", message: err.message });
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteStoredImage = (url: string, accessoryId: string) => {
    console.log(url, accessoryId);
  };
  return (
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      isDismissable={false}
      size="5xl"
      classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isAccessoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : accessoryId ? (
                "Update Accessory"
              ) : (
                "Create Accessory"
              )}
            </ModalHeader>
            {accessoryId && (isAccessoryLoading || isActiveSubCatLoading) ? (
              <JULoading className="h-[300px]" />
            ) : (
              <JUForm methods={methods} onSubmit={handleCreateUpdate}>
                <ModalBody>
                  <div className="flex flex-col md:flex-row gap-5">
                    <JUSelect
                      name="category"
                      options={activeCategoriesOptions as TSelectOption[]}
                      selectProps={{
                        isRequired: true,
                        label: "Category",
                        placeholder: isCatLoading
                          ? "Loading.."
                          : "Select Category",
                        selectionMode: "single",
                        isDisabled: accessoryId ? false : isCatLoading,
                        defaultSelectedKeys: [
                          (accessory?.category as TCategory)?._id,
                        ],
                        className: "w-full md:w-[33%]",
                      }}
                    />
                    <JUSelect
                      name="subCategory"
                      options={activeSubCategoriesOptions!}
                      selectProps={{
                        isRequired: true,
                        label: "Sub Category",
                        defaultSelectedKeys: [
                          (accessory?.subCategory as TSubCategory)?._id,
                        ],
                        placeholder: isActiveSubCatLoading
                          ? "Loading.."
                          : "Select Sub Category",

                        className: "w-full md:w-[33%]",
                      }}
                    />
                    <JUSelect
                      name="isItReturnable"
                      options={returnableOptions!}
                      selectProps={{
                        isRequired: true,
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
                        isRequired: true,
                        label: "Name",
                        type: "text",
                        className: "w-full md:w-[66%]",
                      }}
                    />
                    {!accessory?.isApproved && (
                      <JUInput
                        name="codeTitle"
                        inputProps={{
                          isRequired: true,
                          label: "Code Title",
                          type: "text",
                          className: "w-full md:w-[33%] ",
                          isDisabled: selectedIsItReturnable == "false",
                          classNames: { input: "uppercase p-0 mb-[2px] " },
                          startContent: (
                            <span className="pointer-events-none w-36 ">
                              {accessory
                                ? accessory?.codeTitle
                                    ?.split("-")
                                    .slice(0, 2)
                                    .join("-") + "-"
                                : generateCodeTitle}
                            </span>
                          ),
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-[66%]">
                      <JUFileInput
                        name="image"
                        onPreview={(previews) => setPreviewUrls(previews)}
                      />
                    </div>
                  </div>
                  {previewUrls?.length > 0 && (
                    <PreviewImage previews={previewUrls} />
                  )}
                  {storedImages?.length > 0 && (
                    <PreviewImage
                    heading="Stored Images"
                      previews={storedImages}
                      onDelete={(url) =>
                        handleDeleteStoredImage(url, accessoryId as string)
                      }
                    />
                  )}
                  <JUTextEditor
                    name="description"
                    label="Description"
                    className="h-40 mb-10"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" color="primary" isLoading={isLoading}>
                    {accessoryId ? "Update" : "Submit"}
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
