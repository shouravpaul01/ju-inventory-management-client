"use client";
import {
  AddIcon,
  EditIcon,
  InfoIcon,
  MoreIcon,
} from "@/src/components/icons";
import { Button, ButtonGroup } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CreateUpdateCategoryFromModal from "./_components/CreateUpdateCategoryFromModal";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Chip } from "@heroui/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { TQuery } from "@/src/types";
import { getAllCategories } from "@/src/hooks/Category";
import { useQueryClient } from "@tanstack/react-query";
import JULoading from "@/src/components/ui/JULoading";
import { Tooltip } from "@heroui/tooltip";
import {
  updateCategoryActiveStatus,
  updateCategoryApprovedStatus,
} from "@/src/services/Category";
import { toast } from "sonner";
import HeadingSection from "@/src/components/ui/HeadingSection";
import { Switch } from "@heroui/switch";

export default function ManageCategories() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const modalForm = useDisclosure();

  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const queryParams = useMemo(() => {
    const params: TQuery[] = [{ name: "page", value: page }];
    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }
    return params;
  }, [page, searchParams]);
  const { data, isLoading } = getAllCategories({
    query: queryParams,
  });
  const loadingState = isLoading ? "loading" : "idle";
  useEffect(() => {
    if (!modalForm.isOpen) {
      setCategoryId(null);
    }
  }, [modalForm.isOpen]);

  const handleActiveOrInactive = async (
    categoryId: string,
    isActive: boolean
  ) => {
    const res = await updateCategoryActiveStatus(categoryId, isActive);

    if (res?.success) {
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "categoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };
  const handleApproved = async (categoryId: string) => {
    const res = await updateCategoryApprovedStatus(categoryId);
    if (res?.success) {
     
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "categoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };
  return (
    <div className="space-y-4">

       <HeadingSection title="Manage categories" > 
        <>
        <Button
            size="sm"
            color="primary"
            onPress={() => modalForm.onOpen()}
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
                     href={`/admin/manage-categories/${item?._id}`}
                    >
                      <InfoIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip color="primary" content="Edit Category" showArrow>
                    <Button
                      isIconOnly
                      color="primary"
                      variant="flat"
                      size="sm"
                      onPress={() => {
                        setCategoryId(item?._id!), modalForm.onOpen();
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
      <CreateUpdateCategoryFromModal
        categoryId={categoryId!}
        useDisclosure={modalForm}
      />
      
    </div>
  );
}
