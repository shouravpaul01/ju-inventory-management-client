"use client";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  ImageIcon,
  InfoIcon,
  MoreIcon,
  WidgetIcon,
} from "@/src/components/icons";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import CreateUpdateAccessoryFromModal from "./_components/CreateUpdateAccessoryFromModal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import JULoading from "@/src/components/ui/JULoading";
import { Chip } from "@nextui-org/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Tooltip } from "@nextui-org/tooltip";
import { getAllAccessories } from "@/src/hooks/Accessory";
import { TQuery } from "@/src/types";
import { User } from "@nextui-org/user";
import {
  updateAccessoryActiveStatus,
  updateAccessoryApprovedStatus,
} from "@/src/services/Accessory";
import { toast } from "sonner";
import StockModal from "./_components/StockModal";
import { Avatar } from "@nextui-org/avatar";

export default function ManageAccessories() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const searchTerm = searchParams.get("search");
  const modalForm = useDisclosure();
  const modalStock = useDisclosure();
  const modalDetails = useDisclosure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);

  const [accessoryId, setAccessoryId] = useState<string | null>(null);
  const [stockId, setStockId] = useState<string | null>(null);
  const queryParams = useMemo(() => {
    const params: TQuery[] = [];
    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }
    return params;
  }, [page, searchParams]);
  const { data, isLoading } = getAllAccessories({
    query: queryParams,
  });
  console.log(data, "accessories");
  const loadingState = isLoading ? "loading" : "idle";
  useEffect(() => {
    if (!modalForm.isOpen) {
      setAccessoryId(null);
    }
  }, [modalForm.isOpen]);
  const handleActiveOrInactive = async (
    accessoryId: string,
    isActive: boolean
  ) => {
    const res = await updateAccessoryActiveStatus(accessoryId, isActive);
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "accessoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  const handleApproved = async (accessoryId: string) => {
    const res = await updateAccessoryApprovedStatus(accessoryId);
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });

      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "accessoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  
  return (
    <div>
      <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">
          {tab == "trash" ? "Trash" : "Manage Accessories"}
        </p>
        <div>
          <ButtonGroup size="sm" color="primary" variant="ghost">
            <Button
              href="/admin/manage-accessories"
              as={Link}
              onPress={() => modalForm.onOpen()}
              startContent={<AddIcon className="size-5" />}
            >
              {" "}
              Add
            </Button>
            <Button
              href={
                tab == "trash"
                  ? "/admin/manage-accessories"
                  : "/admin/manage-accessories?tab=trash"
              }
              as={Link}
              startContent={
                tab == "trash" ? (
                  <WidgetIcon className="size-5" />
                ) : (
                  <DeleteIcon className="size-5" />
                )
              }
            >
              {tab == "trash" ? "Manage Accessories" : "Trash"}
            </Button>
          </ButtonGroup>
        </div>
      </div>
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
          <TableColumn key="name" width={300}>
            NAME
          </TableColumn>
          <TableColumn key="quantity">Quantity</TableColumn>
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
              <TableCell>
                <div className="flex items-center gap-2">
                  <div>
                    <Avatar
                      radius="md"
                      fallback={<ImageIcon />}
                      className=" size-20 text-large"
                      src={item?.image}
                    />
                  </div>
                  <div className="space-y-[2px]">
                    <p className="font-bold line-clamp-1">{item.name}</p>
                    <div className="flex items-center gap-1 text-slate-600">
                      <span>Cat:</span>
                      <p className="font-semibold">{item?.category?.name}</p>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600">
                      <span>Sub Cat:</span>
                      <p className="font-semibold">{item?.subCategory?.name}</p>
                    </div>
                    {
                      item?.codeTitle && <div className="flex items-center gap-1 text-slate-600">
                      <span>Code Title:</span>
                      <p className="font-semibold">{item?.codeTitle}</p>
                    </div>
                    }
                    <Chip color={item?.isItReturnable?"success":"warning"} size="sm">{item?.isItReturnable?"Returnable":"Non-returnable"}</Chip>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div>
                    <p>
                      Total Qty:{" "}
                      <Chip radius="sm" size="sm" className="ms-2">
                        {item.quantityDetails.totalQuantity}
                      </Chip>
                    </p>
                    <p>
                      Current Qty:{" "}
                      <Chip radius="sm" size="sm" className="ms-2">
                        {item.quantityDetails.currentQuantity}
                      </Chip>
                    </p>
                    <p>
                      Distributed Qty:{" "}
                      <Chip radius="sm" size="sm" className="ms-2">
                        {item.quantityDetails.distributedQuantity}
                      </Chip>
                    </p>
                    <p>
                      Order Qty:{" "}
                      <Chip radius="sm" size="sm" className="ms-2">
                        {item.quantityDetails.orderQuantity}
                      </Chip>
                    </p>
                  </div>

                  <Tooltip
                    color="success"
                    showArrow
                    content="Update Stock Quantity"
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      isDisabled={!item.approvalDetails.isApproved}
                      onPress={() => {
                        setStockId(item.stock._id!);
                        setAccessoryId(item._id!);
                        modalStock.onOpen();
                      }}
                    >
                      <MoreIcon />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Chip
                    color={item?.isActive ? "success" : "danger"}
                    variant="flat"
                    size="sm"
                  >
                    {item?.isActive ? "Active" : "Inactive"}
                  </Chip>

                  {item?.approvalDetails.isApproved && (
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
                              handleActiveOrInactive(item._id!, true)
                            }
                          >
                            Active
                          </ListboxItem>
                          <ListboxItem
                            key="Inactive"
                            onPress={() =>
                              handleActiveOrInactive(item._id!, false)
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
                    color={
                      item?.approvalDetails.isApproved ? "success" : "danger"
                    }
                    variant="flat"
                    size="sm"
                  >
                    {item?.approvalDetails.isApproved ? "Approved" : "Pending"}
                  </Chip>
                  {!item?.approvalDetails.isApproved && (
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
                            item?.approvalDetails.isApproved
                              ? "Approved"
                              : "Pending",
                          ]}
                          color="primary"
                        >
                          <ListboxItem
                            key="Unblock"
                            onPress={() => handleApproved(item._id!)}
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
                        setAccessoryId(item._id!), modalDetails.onOpen();
                      }}
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
                      isDisabled={item.approvalDetails.isApproved}
                      onPress={() => {
                        setAccessoryId(item._id!), modalForm.onOpen();
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
      <CreateUpdateAccessoryFromModal
        accessoryId={accessoryId!}
        useDisclosure={modalForm}
      />
      <StockModal
        modalStocks={modalStock}
        stockId={stockId!}
        accessoryId={accessoryId!}
      />
    </div>
  );
}
