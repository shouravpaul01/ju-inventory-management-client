"use client";
import {
  AddIcon,
  EditIcon,
  ImageIcon,
  InfoIcon,
  MoreIcon,
  NetworkTreeIcon,
  XmarkIcon,
} from "@/src/components/icons";
import JULoading from "@/src/components/ui/JULoading";
import { TCodeDetails, TQuantityDetails, TQuery } from "@/src/types";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Listbox, ListboxItem } from "@heroui/listbox";

import { DateRangePicker } from "@heroui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Skeleton } from "@heroui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { use, useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { updateStockApprovedStatus } from "@/src/services/Stock";

import { Select, SelectItem } from "@heroui/select";
import { approvalFilterOptions, limitOptions } from "@/src/constents";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { getSingleAccessory } from "@/src/hooks/Accessory";
import { getAllStocks } from "@/src/hooks/Stock";

import { useDisclosure } from "@heroui/modal";

import { Switch } from "@heroui/switch";
import Link from "next/link";
import UpdateStockQuantityModal from "./UpdateStockQuantityModal";
import StockModal from "./StockModal";
import UpdateStockModal from "./UpdateStockModal";

export default function StockTable({
  accessoryId,
  stockId,
}: {
  accessoryId: string;
  stockId: string;
}) {
  const queryClient = useQueryClient();
  const modalUpdateStock = useDisclosure();

  const [stockDetailsId, setStockDetailsId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>();
  const [approvalStatus, setApprovalStatus] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(5);
  const { data: accessory, isLoading: isAccessoryLoading } = getSingleAccessory(
    accessoryId!
  );
  console.log(accessory, accessoryId, "accessorie");
  useEffect(() => {
    if (!modalUpdateStock.isOpen) {
      setStockDetailsId(null);
    }
  }, [modalUpdateStock.isOpen]);
  const queryParams = useMemo(() => {
    const params: TQuery[] = [];
    if (stockId) {
      params.push({ name: "limit", value: limit });
      params.push({ name: "page", value: page });
      params.push({ name: "_id", value: stockId });
    }
    if (approvalStatus) {
      params.push({ name: "approvalStatus", value: approvalStatus });
    }
    if (dateRange?.start && dateRange?.end) {
      params.push({
        name: "startDate",
        value: dayjs(dateRange?.start as any).format("YYYY-MM-DD"),
      });
      params.push({
        name: "endDate",
        value: dayjs(dateRange?.end as any).format("YYYY-MM-DD"),
      });
    }

    return params;
  }, [page, limit, stockId, approvalStatus, dateRange]);

  const { data, isLoading } = getAllStocks({
    query: queryParams,
  });
  const loadingState = isLoading ? "loading" : "idle";
  const handleApproved = async (stockId: string, stockDetailsId: string) => {
    const res = await updateStockApprovedStatus(stockId, stockDetailsId);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["single-accessory"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "stockError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  const handleFilterClear = () => {
    setPage(1);
    setLimit(5);
    setApprovalStatus("");
    setDateRange(null);
  };
  return (
    <div className="space-y-3">
      <h4 className="text-md border-b border-dashed pb-1 ">Stock Table</h4>
      <div className="flex justify-end flex-col md:flex-row  items-center gap-2">
        <div className="w-full md:w-3/4 flex flex-col md:flex-row items-center gap-2">
          <DateRangePicker
            className="max-w-xs "
            label="Filter By Date"
            variant="bordered"
            showMonthAndYearPickers
            pageBehavior="single"
            value={dateRange!}
            onChange={(date: any) => setDateRange(date)}
          />
          <Select
            className="max-w-xs"
            label="Filter By Approval"
            placeholder="Select Option"
            variant="bordered"
            selectedKeys={[approvalStatus]}
            onChange={(option: any) => setApprovalStatus(option.target.value)}
          >
            {approvalFilterOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          <Select
            className="max-w-20"
            label="Limit"
            placeholder="Select Limit"
            variant="bordered"
            selectedKeys={[limit]}
            onChange={(option: any) => setLimit(option.target.value)}
          >
            {limitOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          {(!!dateRange || !!approvalStatus) && (
            <Tooltip content="Clear Filter" showArrow={true} color="foreground">
              <Button
                className="size-6"
                radius="full"
                isIconOnly
                onPress={() => handleFilterClear()}
              >
                <XmarkIcon />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      {isLoading ? (
        <JULoading className="h-[300px]" />
      ) : (
        <Table
          aria-label="Example table with client side pagination"
          removeWrapper
          classNames={{
            wrapper: "min-h-[222px] ",
          }}
          bottomContent={
            <div className="flex w-full justify-center">
              <Button
                isDisabled={isLoading}
                variant="flat"
                onPress={() => setPage((prev) => prev + 1)}
              >
                {isLoading && <Spinner color="white" size="sm" />}
                Load More
              </Button>
            </div>
          }
        >
          <TableHeader>
            <TableColumn key="name">Stock Date</TableColumn>
            <TableColumn key="quantity">Quantity</TableColumn>
            <TableColumn key="codes">Codes</TableColumn>
            <TableColumn key="approval">Approval</TableColumn>
            <TableColumn key="action">Action</TableColumn>
          </TableHeader>
          <TableBody
            items={data?.details ?? []}
            loadingContent={<JULoading className="h-auto" />}
            loadingState={loadingState}
            emptyContent={<p className="w-full">Data not found.</p>}
          >
            {(item) => (
              <TableRow key={item._id}>
                <TableCell>
                  {dayjs(item.createdAt).format("MMM D, YYYY")}
                </TableCell>
                <TableCell>
                  <Chip color="success" variant="flat" size="sm">
                    {item.quantity}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    content={
                      <div className="max-w-xs flex flex-wrap gap-3">
                        {item.accessoryCodes.map((code, index) => (
                          <Chip
                            key={index}
                            color="success"
                            variant="flat"
                            size="sm"
                          >
                            {code}
                          </Chip>
                        ))}
                      </div>
                    }
                    showArrow={true}
                  >
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      radius="full"
                      isDisabled={!item?.isApproved}
                    >
                      Codes
                    </Button>
                  </Tooltip>
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
                          onValueChange={(value) =>
                            handleApproved(stockId, item?._id!)
                          }
                        />
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip color="primary" content="Stock Details" showArrow>
                      <Button
                        isIconOnly
                        color="primary"
                        variant="flat"
                        size="sm"
                        as={Link}
                        href={`/admin/manage-accessories/${accessoryId}/stock/${stockId}?details=${item?._id}`}
                      >
                        <InfoIcon />
                      </Button>
                    </Tooltip>

                    <Tooltip color="primary" content="Edit Stock" showArrow>
                      <Button
                        isIconOnly
                        color="primary"
                        variant="flat"
                        size="sm"
                        isDisabled={item?.isApproved}
                        onPress={() => {
                          setStockDetailsId(item._id!),
                            modalUpdateStock.onOpen();
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
      )}
      <UpdateStockModal
      useDisclosure={modalUpdateStock}
      stockId={stockId}
      stockDetailsId={stockDetailsId!}
      
      
      />
    </div>
  );
}
