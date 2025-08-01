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
import DetailsModal from "./_components/DetailsModal";

export default function ManageCategories() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const modalForm = useDisclosure();
  const modalDetails = useDisclosure();
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
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "categoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  const handleApproved = async (categoryId: string) => {
    const res = await updateCategoryApprovedStatus(categoryId);
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "categoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">Manage Categories</p>
        <div>
          <Button
            size="sm"
            color="primary"
            variant="ghost"
            href="/admin/manage-categories"
            as={Link}
            onPress={() => modalForm.onOpen()}
            startContent={<AddIcon className="size-5 " />}
          >
            {" "}
            Add
          </Button>
        </div>
      </div>{" "}
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
                  <Chip color={item?.isActive ?"success":"danger"} variant="flat" size="sm">
                    {item?.isActive ? "Active" : "Inactive"}
                  </Chip>

                  {item?.approvalDetails?.isApproved && (
                    <Popover placement="bottom" showArrow={true}>
                      <PopoverTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                        >
                          {" "}
                          <MoreIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Listbox
                          aria-label="Single selection example"
                          variant="solid"
                          disallowEmptySelection
                          selectionMode="single"
                          selectedKeys={[
                            item?.isActive ? "Active" : "Inactive",
                          ]}
                          disabledKeys={[
                            item?.isActive ? "Active" : "Inactive",
                          ]}
                          color="primary"
                        >
                          <ListboxItem
                            key="Active"
                            onPress={() =>
                              handleActiveOrInactive(item._id, true)
                            }
                          >
                            Active
                          </ListboxItem>
                          <ListboxItem
                            key="Inactive"
                            onPress={() =>
                              handleActiveOrInactive(item._id, false)
                            }
                          >
                            Inactive
                          </ListboxItem>
                        </Listbox>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {" "}
                <div className="flex items-center gap-2">
                  <Chip
                    color={item?.approvalDetails?.isApproved ? "success" : "danger"}
                    variant="flat"
                    size="sm"
                  >
                    {item?.approvalDetails?.isApproved ? "Approved" : "Pending"}
                  </Chip>
                  {!item?.approvalDetails?.isApproved && (
                    <Popover placement="bottom" showArrow={true}>
                      <PopoverTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                        >
                          {" "}
                          <MoreIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Listbox
                          aria-label="Single selection example"
                          variant="solid"
                          disallowEmptySelection
                          selectionMode="single"
                          selectedKeys={[
                            item?.approvalDetails?.isApproved ? "Approved" : "Pending",
                          ]}
                          color="primary"
                        >
                          <ListboxItem
                            key="Unblock"
                            onPress={() => handleApproved(item._id)}
                          >
                            Approved
                          </ListboxItem>
                        </Listbox>
                      </PopoverContent>
                    </Popover>
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
                      onPress={() => {
                        setCategoryId(item._id), modalDetails.onOpen();
                      }}
                    >
                      <InfoIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip color="primary" content="Edit user" showArrow>
                    <Button
                      isIconOnly
                      color="primary"
                      variant="flat"
                      size="sm"
                      onPress={() => {
                        setCategoryId(item._id), modalForm.onOpen();
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
      <DetailsModal categoryId={categoryId!} useDisclosure={modalDetails} />
    </div>
  );
}
