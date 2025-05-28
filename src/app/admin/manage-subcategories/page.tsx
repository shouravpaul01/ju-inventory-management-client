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
import DetailsModal from "./_components/DetailsModal";

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
    <div>
      <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">Manage Sub-Categories</p>
        <div>
          <Button
            size="sm"
            color="primary"
            variant="ghost"
            href="/admin/manage-subcategories"
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
                        setSubCategoryId(item._id), modalDetails.onOpen();
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
      <DetailsModal subCategoryId={subCategoryId!} useDisclosure={modalDetails}/>
    </div>
  );
}
