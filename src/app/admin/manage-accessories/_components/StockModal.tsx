import {
  AddIcon,
  EditIcon,
  ImageIcon,
  InfoIcon,
  MoreIcon,
} from "@/src/components/icons";
import JULoading from "@/src/components/ui/JULoading";
import { getAllStocks } from "@/src/hooks/Stock";
import { TQuery } from "@/src/types";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  UseDisclosureProps,
} from "@nextui-org/modal";
import { DateRangePicker } from "@nextui-org/date-picker";
import { Pagination } from "@nextui-org/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Skeleton } from "@nextui-org/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Tooltip } from "@nextui-org/tooltip";
import { User } from "@nextui-org/user";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import UpdateStock from "./UpdateStockModal";
import UpdateStockModal from "./UpdateStockModal";
import { toast } from "sonner";
import { updateStockApprovedStatus } from "@/src/services/Stock";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/select";
import { approvalFilterOptions } from "@/src/constents";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

interface IProps {
  modalStocks: UseDisclosureProps | any;
  stockId?: string;
}
export default function StockModal({ modalStocks, stockId }: IProps) {
  const queryClient = useQueryClient();
  const modalUpdateStock = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [stockDetailsId, setStockDetailsId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: parseDate("2025-04-01"),
    end: parseDate("2025-04-08"),
  });
  const [isApproved, setIsApproved] = useState(new Set([]));

  useEffect(() => {
    if (!modalUpdateStock.isOpen) {
      setStockDetailsId(null);
    }
  }, [modalUpdateStock.isOpen]);
  const queryParams = useMemo(() => {
    const params: TQuery[] = [];
    if (stockId) {
      params.push({ name: "_id", value: stockId });
    }
    return params;
  }, [page, stockId]);
  const { data, isLoading } = getAllStocks({
    query: queryParams,
  });
  const loadingState = isLoading ? "loading" : "idle";
  const handleApproved = async (stockId: string, stockDetailsId: string) => {
    console.log(stockId);
    const res = await updateStockApprovedStatus(stockId, stockDetailsId);
    console.log(res, "data");
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "stockError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  return (
    <>
      <Modal
        isOpen={modalStocks.isOpen}
        onOpenChange={modalStocks.onOpenChange}
        isDismissable={false}
        size="4xl"
        classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isLoading ? (
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                ) : (
                  "Stock Details"
                )}
              </ModalHeader>
              <ModalBody>
                <div>
                  <Card className="" shadow="none">
                    <CardHeader>
                      <p className="font-bold text-lg">Quantity</p>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <div className="flex flex-wrap gap-5">
                        <p>
                          Total Qty:{" "}
                          <Chip radius="sm" size="sm" className="ms-2">
                            {data?.quantityDetails.totalQuantity}
                          </Chip>
                        </p>
                        <p>
                          Current Qty:{" "}
                          <Chip radius="sm" size="sm" className="ms-2">
                            {data?.quantityDetails.currentQuantity}
                          </Chip>
                        </p>
                        <p>
                          Distributed Qty:{" "}
                          <Chip radius="sm" size="sm" className="ms-2">
                            {data?.quantityDetails.distributedQuantity}
                          </Chip>
                        </p>
                        <p>
                          Order Qty:{" "}
                          <Chip radius="sm" size="sm" className="ms-2">
                            {data?.quantityDetails.orderQuantity}
                          </Chip>
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="" shadow="none">
                    <CardHeader>
                      <p className="font-bold text-md text-slate-600">
                        Accessory Codes
                      </p>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <div className="flex flex-wrap gap-5">
                        <Tooltip
                          content={
                            <div className="max-w-xs flex flex-wrap gap-3">
                              {data?.codeDetails?.totalCodes?.map(
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
                                {data?.codeDetails?.totalCodes?.length}
                              </span>
                            }
                          >
                            Total Codes:
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content={
                            <div className="max-w-xs flex flex-wrap gap-3">
                              {data?.codeDetails?.currentCodes?.map(
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
                                {data?.codeDetails?.currentCodes?.length}
                              </span>
                            }
                          >
                            Current Codes:
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content={
                            <div className="max-w-xs flex flex-wrap gap-3">
                              {data?.codeDetails?.distributedCodes?.map(
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
                                {data?.codeDetails?.distributedCodes?.length}
                              </span>
                            }
                          >
                            Distributed Codes:
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content={
                            <div className="max-w-xs flex flex-wrap gap-3">
                              {data?.codeDetails?.orderCodes?.map(
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
                                {data?.codeDetails?.orderCodes?.length}
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
                <div className="flex flex-col md:flex-row  items-center gap-2">
                  <div className="w-full md:w-1/2">
                    <Button
                      className=""
                      color="primary"
                      size="md"
                      startContent={<AddIcon className="fill-white" />}
                      onPress={() => modalUpdateStock.onOpen()}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-2">
                    <DateRangePicker
                      className="max-w-xs "
                      label="Filter By Date"
                      pageBehavior="single"
                      visibleMonths={2}
                      value={dateRange}
                      onChange={() => setDateRange}
                      autoFocus={true}
                    />
                    <Select
                      className="max-w-xs"
                      label="Filter By Approval"
                      placeholder="Select Option"
                      selectedKeys={isApproved}
                      variant="bordered"
                      onSelectionChange={() => setIsApproved}
                    >
                      {approvalFilterOptions.map((option) => (
                        <SelectItem key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
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
                  >
                    <TableHeader>
                      <TableColumn key="name">Stock Date</TableColumn>
                      <TableColumn key="approval">Quantity</TableColumn>
                      <TableColumn key="approval">Codes</TableColumn>
                      <TableColumn key="approval">Approval</TableColumn>
                      <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                      items={data?.details ?? []}
                      loadingContent={<JULoading className="h-auto" />}
                      loadingState={loadingState}
                      emptyContent={<p>Data not found.</p>}
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
                                isDisabled={!item.approvalDetails.isApproved}
                              >
                                Codes
                              </Button>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <div className="flex items-center gap-2">
                              <Chip
                                color={
                                  item?.approvalDetails.isApproved
                                    ? "success"
                                    : "danger"
                                }
                                variant="flat"
                                size="sm"
                              >
                                {item?.approvalDetails.isApproved
                                  ? "Approved"
                                  : "Pending"}
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
                                        onPress={() =>
                                          handleApproved(stockId!, item._id!)
                                        }
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
                              <Tooltip
                                color="primary"
                                content="Details"
                                showArrow
                              >
                                <Button
                                  isIconOnly
                                  color="primary"
                                  variant="flat"
                                  size="sm"
                                >
                                  <InfoIcon />
                                </Button>
                              </Tooltip>

                              <Tooltip
                                color="primary"
                                content="Edit Stock"
                                showArrow
                              >
                                <Button
                                  isIconOnly
                                  color="primary"
                                  variant="flat"
                                  size="sm"
                                  isDisabled={item.approvalDetails.isApproved}
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <UpdateStockModal
        useDisclosure={modalUpdateStock}
        stockId={stockId}
        stockDetailsId={stockDetailsId!}
      />
    </>
  );
}
