"use client";
import { ImageIcon, XmarkIcon } from "@/src/components/icons";
import { limitOptions, orderEventOptions } from "@/src/constents";
import { getAllOrders } from "@/src/hooks/order";
import { TQuery, TUser } from "@/src/types";
import { Button } from "@nextui-org/button";
import { DateRangePicker } from "@nextui-org/date-picker";
import { Select, SelectItem } from "@nextui-org/select";
import { Tooltip } from "@nextui-org/tooltip";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import React, { useMemo, useState } from "react";
import JULoading from "@/src/components/ui/JULoading";
import { Pagination } from "@nextui-org/pagination";
import { Chip } from "@nextui-org/chip";
import dayjs from "dayjs";
import { User } from "@nextui-org/user";
import UserInfoTooltip from "./_components/UserInfoTooltip";
import { Badge } from "@nextui-org/badge";

export default function ManageOrdersPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const [dateRange, setDateRange] = useState<any>();
  const [approvalStatus, setApprovalStatus] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(5);
  const queryParams = useMemo(() => {
    const params: TQuery[] = [];
    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }
    return params;
  }, [page, searchParams]);
  const { data, isLoading: isOrdersLoading } = getAllOrders({
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
  return (
    <div>
      <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">Manage Orders</p>
      </div>
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
          <TableColumn key="name" width={250}>
            Order ID
          </TableColumn>
          <TableColumn key="quantity">Order Items</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="approval">Approval</TableColumn>
          <TableColumn key="action">Action</TableColumn>
        </TableHeader>
        <TableBody
          items={data?.data ?? []}
          loadingContent={<JULoading className="h-auto" />}
          loadingState={loadingState}
          emptyContent={<p className="">Data not found.</p>}
        >
          {(item) => (
            <TableRow key={item._id!}>
              <TableCell>
                <User
                  classNames={{ description: "text-black" }}
                  avatarProps={{
                    radius: "lg",
                    src: (item?.orderBy as TUser).faculty?.image,

                    fallback: <ImageIcon />,
                  }}
                  description={
                    <div>
                      <div className="flex items-center gap-1">
                        <span>INV:</span>
                        <p className="text-sm font-bold">{item.invoiceId}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <span>Date:</span>
                        <Chip size="md">
                          {dayjs(item.orderDate).format("MMM D, YYYY h:mm A")}
                        </Chip>
                      </div>
                    </div>
                  }
                  name={
                    <Tooltip content={<UserInfoTooltip user={item.orderBy as TUser}/>} showArrow={true} classNames={{content:"py-2"}}>
                      <div className="flex items-center gap-1">
                        <span> Name:</span>
                        <p className="font-bold">
                          {(item?.orderBy as TUser).faculty?.name}
                        </p>
                      </div>
                    </Tooltip>
                  }
                />
              </TableCell>
              <TableCell>
              <Badge color="danger" content={item.items?.length || 0} shape="circle" size="md">
              <Tooltip content="Set Deadline" showArrow={true} >
             
                <Button color="primary" size="sm" >Items</Button>
                
                </Tooltip>
                </Badge>
              </TableCell>
              <TableCell>""</TableCell>
              <TableCell>
                {" "}
                {/* <div className="flex items-center gap-2">
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
                </div> */}
              </TableCell>
              <TableCell>
                ""
                {/* <div className="relative flex items-center gap-2">
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
                </div> */}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
