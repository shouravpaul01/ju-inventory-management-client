"use client"
import { AddIcon, EditIcon, InfoIcon, MoreIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CreateUpdateSubCategoryFromModal from "./_components/CreateUpdateSubCategoryFromModal";
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import JULoading from "@/src/components/ui/JULoading";
import { Chip } from "@heroui/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { TQuery } from "@/src/types";
import { getAllSubCategories } from "@/src/hooks/Sub Category";
import { updateSubCategoryActiveStatus, updateSubCategoryApprovedStatus } from "@/src/services/Sub Category";
import { toast } from "sonner";
import { Tooltip } from "@heroui/tooltip";
import { Switch } from "@heroui/switch";
import HeadingSection from "@/src/components/ui/HeadingSection";

export default function ManageSubCategories() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const modalForm = useDisclosure();
  const modalDetails = useDisclosure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
  const queryParams = useMemo(() => {
    const params: TQuery[] = [{ name: "page", value: page }];
    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }
    return params;
  }, [page, searchParams]);
  const { data, isLoading } = getAllSubCategories({
    query: queryParams,
  });
  const loadingState = isLoading ? "loading" : "idle";
  useEffect(() => {
    if (!modalForm.isOpen) {
      console.log("hi")
        setSubCategoryId(null);
    }
  }, [modalForm.isOpen]);

  const handleActiveOrInactive = async (
    subCategoryId: string,
    isActive: boolean
  ) => {
    const res = await updateSubCategoryActiveStatus(subCategoryId, isActive);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "subCategoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  const handleApproved = async (subCategoryId: string) => {
    const res = await updateSubCategoryApprovedStatus(subCategoryId);
    console.log(res)
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "subCategoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  return (
    <div className="space-y-4">
    <HeadingSection title="Manage Sub Categories" > 
        <>
        <Button
            size="sm"
            color="primary"
            onPress={() =>{setSubCategoryId(null), modalForm.onOpen()}}
            startContent={<AddIcon className="size-5 fill-white" />}
          >
            {" "}
            Add
          </Button>
        </>
      </HeadingSection>
      <Table
        aria-label="Example table with client side pagination"
        removeWrapper
        shadow="none"
        bottomContent={
          <div className=" w-full ">
            <Pagination
              showControls
              color="primary"
              page={page}
              total={data?.totalPages || 0}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px] ",
        }}
      >
        <TableHeader>
          <TableColumn key="name">NAME</TableColumn>
          <TableColumn key="category">Category</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="approval">Approval</TableColumn>
          <TableColumn key="action">Action</TableColumn>
        </TableHeader>
        <TableBody
          items={data?.data ?? []}
          loadingContent={<JULoading className="h-auto" />}
          loadingState={loadingState}
          emptyContent={<p>Data not found.</p>}
        >
          {(item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Chip
                    color={item?.isActive ? "success" : "danger"}
                    variant="flat"
                    size="sm"
                  >
                    {item?.isActive ? "Activated" : "Deactivated"}
                  </Chip>

                  {item?.isApproved && (
                    <Tooltip
                      content={
                        item?.isActive
                          ? "Deactivate this Category? Click to proceed."
                          : "Activate this Category? Click to proceed."
                      }
                    >
                      <Switch
                        isSelected={item?.isActive}
                        color={item?.isActive ? "primary" : "danger"}
                        size="sm"
                        onValueChange={() =>
                          handleActiveOrInactive(
                            item?._id!,
                            item?.isActive ? false : true
                          )
                        }
                      />
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {" "}
                <div className="flex items-center gap-2">
                  <Chip
                    color={item?.isApproved ? "success" : "danger"}
                    variant="flat"
                    size="sm"
                  >
                    {item?.isApproved ? "Approved" : "Pending"}
                  </Chip>
                  {!item?.isApproved && (
                    <Tooltip content="Do you confirm the approval? Please click to proceed.">
                      <Switch
                        isSelected={item?.isApproved}
                        color="primary"
                        size="sm"
                        onValueChange={(value) => handleApproved(item?._id!)}
                      />
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip color="primary" content="Details" showArrow>
                    <Button
                      isIconOnly
                      color="primary"
                      variant="flat"
                      size="sm"
                     as={Link}
                     href={`/admin/manage-subcategories/${item?._id}`}
                    >
                      <InfoIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip color="primary" content="Edit" showArrow>
                    <Button
                      isIconOnly
                      color="primary"
                      variant="flat"
                      size="sm"
                      onPress={() => {
                        setSubCategoryId(item._id), modalForm.onOpen();
                      }}
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CreateUpdateSubCategoryFromModal subCategoryId={subCategoryId!} useDisclosure={modalForm}/>
    </div>
  );
}
