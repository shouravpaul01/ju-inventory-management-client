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
import { Button, ButtonGroup } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
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
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import JULoading from "@/src/components/ui/JULoading";
import { Chip } from "@heroui/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Tooltip } from "@heroui/tooltip";
import { getAllAccessories } from "@/src/hooks/Accessory";
import { TCategory, TQuery, TStock, TSubCategory } from "@/src/types";
import { User } from "@heroui/user";
import {
  updateAccessoryActiveStatus,
  updateAccessoryApprovedStatus,
} from "@/src/services/Accessory";
import { toast } from "sonner";
import StockModal from "./_components/StockModal";
import { Avatar } from "@heroui/avatar";
import HeadingSection from "@/src/components/ui/HeadingSection";
import { Switch } from "@heroui/switch";

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
    <div className="space-y-4">
      <HeadingSection title="Manage Accessories" > 
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
                      <p className="font-semibold">{(item?.category as TCategory).name}</p>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600">
                      <span>Sub Cat:</span>
                      <p className="font-semibold">{(item?.subCategory as TSubCategory)?.name}</p>
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
                    <div>
                      Total Qty:{" "}
                      <Chip radius="sm" size="sm" className="ms-2">
                        {item.quantityDetails.totalQuantity}
                      </Chip>
                    </div>
                    <div>
                      Current Qty:{" "}
                      <Chip radius="sm" size="sm" className="ms-2">
                        {item.quantityDetails.currentQuantity}
                      </Chip>
                    </div>
                    <div>
                      Distributed Qty:{" "}
                      <Chip radius="sm" size="sm" className="ms-2">
                        {item.quantityDetails.distributedQuantity}
                      </Chip>
                    </div>
                    <div>
                      Order Qty:{" "}
                      <Chip radius="sm" size="sm" className="ms-2">
                        {item.quantityDetails.orderQuantity}
                      </Chip>
                    </div>
                  </div>
                  <Tooltip color="primary" content="Stock Details" showArrow>
                    <Button
                      isIconOnly
                      color="primary"
                      variant="flat"
                      size="sm"
                     as={Link}
                     href={`/admin/manage-accessories/${item?._id}/stock/${(item?.stock as TStock)?._id}`}
                    >
                      <InfoIcon />
                    </Button>
                  </Tooltip>
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
                      isDisabled={!item?.isApproved}
                      onPress={() => {
                        setStockId((item.stock as TStock)?._id!);
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
                    {item?.isActive ? "Activated" : "Deactivated"}
                  </Chip>

                  {item?.isApproved && (
                    <Tooltip
                      content={
                        item?.isActive
                          ? "Deactivate this Accessory? Click to proceed."
                          : "Activate this Accessory? Click to proceed."
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
                     href={`/admin/manage-accessories/${item?._id}`}
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
                      // isDisabled={item?.isApproved}
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
