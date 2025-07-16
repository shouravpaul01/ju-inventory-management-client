"use client";
import {
  ImageIcon,
  InfoIcon,
  MoreIcon,
  PrintIcon,
  XmarkIcon,
} from "@/src/components/icons";
import { limitOptions, orderEventOptions } from "@/src/constents";
import { getAllOrders, useGetAllUserOrders } from "@/src/hooks/order";
import { TAccessory, TQuery, TUser } from "@/src/types";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";
import { Tooltip } from "@heroui/tooltip";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React, { useMemo, useState } from "react";
import JULoading from "@/src/components/ui/JULoading";
import { Pagination } from "@heroui/pagination";
import { Chip } from "@heroui/chip";
import dayjs from "dayjs";
import { User } from "@heroui/user";
// import UserInfoTooltip from "./_components/UserInfoTooltip";
import { Badge } from "@heroui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { updateEventStatusReq } from "@/src/services/order";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDisclosure } from "@heroui/modal";
import { useGetCurrentUser } from "@/src/hooks/Auth";
import Link from "next/link";
import HeadingSection from "@/src/components/ui/HeadingSection";

export default function MyOrdersPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const [dateRange, setDateRange] = useState<any>();
  const [approvalStatus, setApprovalStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(5);
  const queryClient = useQueryClient();
  const modelOrderItems = useDisclosure();
  const modalReturnAccessories = useDisclosure();
  const queryParams = useMemo(() => {
    const params: TQuery[] = [];
    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }
    return params;
  }, [page, searchParams]);
  const { data: user } = useGetCurrentUser();
  const { data, isLoading: isOrdersLoading } = useGetAllUserOrders({
    userId: user?._id!,
    query: queryParams,
  });
  const loadingState = isOrdersLoading ? "loading" : "idle";

  console.log(data, "data");

  const handleFilterClear = () => {
    setPage(1);
    setLimit(5);
    setApprovalStatus("");
    setDateRange(null);
  };
  const handleEventStatus = async (orderId: string, event: string) => {
    const res = await updateEventStatusReq(orderId, event);
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "orderError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  return (
    <div>
      <HeadingSection title="Manage Orders" />
      <div className="flex flex-col md:flex-row  items-center justify-end gap-2 my-4">
        <DateRangePicker
          className="max-w-[250px] "
          label="Filter By Date"
          variant="bordered"
          showMonthAndYearPickers
          pageBehavior="single"
          value={dateRange!}
          onChange={(date: any) => setDateRange(date)}
        />
        <Select
          className="max-w-[150px]"
          label="Filter By Event"
          placeholder="Select Option"
          variant="bordered"
          selectedKeys={[approvalStatus]}
          onChange={(option: any) => setApprovalStatus(option.target.value)}
        >
          {orderEventOptions.map((option) => (
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
            Order ID
          </TableColumn>
          <TableColumn key="quantity">
             Accessories
          </TableColumn>

          <TableColumn key="status" width={240}>
            Status
          </TableColumn>

          <TableColumn key="action">Action</TableColumn>
        </TableHeader>
        <TableBody
          items={data?.data ?? []}
          loadingContent={<JULoading className="h-auto" />}
          loadingState={loadingState}
          emptyContent={<p className="">Data not found.</p>}
        >
          {(order) => (
            <TableRow key={order._id!}>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span>INV:</span>
                    <p className="text-sm font-bold">{order.invoiceId}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <span>Order D:</span>
                    <Chip size="md">
                      {dayjs(order.orderDate).format("MMM D, YYYY h:mm A")}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Expected D:</span>
                    <Chip size="md">
                      {dayjs(order?.expectedDeliveryDateTime).format(
                        "MMM D, YYYY h:mm A"
                      )}
                    </Chip>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  color="danger"
                  content={order.items?.length || 0}
                  shape="circle"
                  size="sm"
                >
                  <Tooltip
                    content={
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span>Total Accessories:</span>
                          <Chip size="sm" radius="full" color="success">
                            {order.items?.length || 0}
                          </Chip>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Returnable Accessories:</span>
                          <Chip size="sm" radius="full" color="success">
                            {order.items?.filter(
                              (item) =>
                                (item.accessory as TAccessory)?.isItReturnable
                            ).length || 0}
                          </Chip>
                        </div>
                      </div>
                    }
                    showArrow={true}
                  >
                    <Button
                      as={Link}
                      href={`/dashboard/my-orders/${order?._id}`}
                      color="primary"
                      size="sm"
                    >
                      Accessories
                    </Button>
                  </Tooltip>
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-1">
                  {orderEventOptions.slice(1).map((event, index) => (
                    <div key={index} className="flex  gap-1">
                      <Chip
                        color={
                          order?.events
                            ?.map((element) => element.event)
                            .includes(event.value as any)
                            ? "success"
                            : "danger"
                        }
                        size="sm"
                      >
                        {event.label}
                      </Chip>
                    </div>
                  ))}

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
                        selectedKeys={order?.events?.map(
                          (event) => event.event
                        )}
                        disabledKeys={order?.events?.map(
                          (event) => event.event
                        )}
                        color="primary"
                      >
                        <ListboxItem
                          key="received"
                          onPress={() =>
                            handleEventStatus(order._id, "received")
                          }
                        >
                          Received
                        </ListboxItem>
                        <ListboxItem
                          key="Cancelled"
                          onPress={() =>
                            handleEventStatus(order._id, "Cancelled")
                          }
                        >
                          Cancelled
                        </ListboxItem>
                      </Listbox>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-2">
                  <Tooltip color="primary" content="Details" showArrow>
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      startContent={<InfoIcon />}
                    >
                      Info
                    </Button>
                  </Tooltip>

                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    startContent={<PrintIcon className="fill-gray-500" />}
                  >
                    Print
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
