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
import UpdateStockModal from "../../../_components/UpdateStockModal";
import { useDisclosure } from "@heroui/modal";
import HeadingSection from "@/src/components/ui/HeadingSection";
import { Switch } from "@heroui/switch";
export default function StockPage({
  params,
}: {
  params: Promise<{ accessoryId: string; stockId: string }>;
}) {
  const { accessoryId, stockId } = use(params);
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
  console.log(data, "stocklll", queryParams);
  return (
    <div>
      <HeadingSection title="Stock Details" linkUrl="/admin/manage-accessories">
        <Button
          className=""
          color="primary"
          size="sm"
          startContent={<NetworkTreeIcon className="fill-white" />}
          onPress={() => modalUpdateStock.onOpen()}
        >
          Stock
        </Button>
      </HeadingSection>
      <div>
        <Card className="" shadow="none">
          <CardHeader>
            <p className="font-bold text-lg">Quantity</p>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-wrap gap-5">
              {isAccessoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3  rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : (
                <p>
                  Total Qty:{" "}
                  <Chip radius="sm" size="sm" className="ms-2">
                    {accessory?.quantityDetails?.totalQuantity || 0}
                  </Chip>
                </p>
              )}

              {isAccessoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3  rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : (
                <p>
                  Current Qty:{" "}
                  <Chip radius="sm" size="sm" className="ms-2">
                    {accessory?.quantityDetails?.currentQuantity || 0}
                  </Chip>
                </p>
              )}
              {isAccessoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3  rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : (
                <p>
                  Distributed Qty:{" "}
                  <Chip radius="sm" size="sm" className="ms-2">
                    {accessory?.quantityDetails?.distributedQuantity || 0}
                  </Chip>
                </p>
              )}
              {isAccessoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3  rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : (
                <p>
                  Order Qty:{" "}
                  <Chip radius="sm" size="sm" className="ms-2">
                    {accessory?.quantityDetails?.orderQuantity || 0}
                  </Chip>
                </p>
              )}
            </div>
          </CardBody>
        </Card>
        <Card className="" shadow="none">
          <CardHeader>
            <p className="font-bold text-md text-slate-600">Accessory Codes</p>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-wrap gap-5">
              <Tooltip
                content={
                  <div className="max-w-xs flex flex-wrap gap-3">
                    {accessory?.codeDetails?.totalCodes?.map((code, index) => (
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
                  endContent={
                    <span className="font-extrabold">
                      {accessory?.codeDetails?.totalCodes?.length}
                    </span>
                  }
                >
                  Total Codes:
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  <div className="max-w-xs flex flex-wrap gap-3">
                    {accessory?.codeDetails?.currentCodes?.map(
                      (code, index) => (
                        <Chip
                          key={index}
                          color="success"
                          variant="flat"
                          size="sm"
                        >
                          {code}
                        </Chip>
                      )
                    )}
                  </div>
                }
                showArrow={true}
              >
                <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  radius="full"
                  endContent={
                    <span className="font-extrabold">
                      {accessory?.codeDetails?.currentCodes?.length}
                    </span>
                  }
                >
                  Current Codes:
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  <div className="max-w-xs flex flex-wrap gap-3">
                    {accessory?.codeDetails?.distributedCodes?.map(
                      (code, index) => (
                        <Chip
                          key={index}
                          color="success"
                          variant="flat"
                          size="sm"
                        >
                          {code}
                        </Chip>
                      )
                    )}
                  </div>
                }
                showArrow={true}
              >
                <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  radius="full"
                  endContent={
                    <span className="font-extrabold">
                      {accessory?.codeDetails?.distributedCodes?.length}
                    </span>
                  }
                >
                  Distributed Codes:
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  <div className="max-w-xs flex flex-wrap gap-3">
                    {accessory?.codeDetails?.orderCodes?.map((code, index) => (
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
                  endContent={
                    <span className="font-extrabold">
                      {accessory?.codeDetails?.orderCodes?.length}
                    </span>
                  }
                >
                  Ordered Codes:
                </Button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>
      </div>
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
          shadow="none"
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
                        onValueChange={(value) => handleApproved(stockId,item?._id!)}
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
