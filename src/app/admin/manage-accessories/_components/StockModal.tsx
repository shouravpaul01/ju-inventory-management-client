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
import { useMemo, useState } from "react";
import UpdateStock from "./UpdateStockModal";
import UpdateStockModal from "./UpdateStockModal";
import { toast } from "sonner";
import { updateStockApprovedStatus } from "@/src/services/Stock";

interface IProps {
  modalStocks: UseDisclosureProps | any;
  stockId?: string;
}
export default function StockModal({ modalStocks, stockId }: IProps) {
  const queryClient = useQueryClient();
  const modalUpdateStock = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const queryParams = useMemo(() => {
    const params: TQuery[] = [{ name: "page", value: page }];
    if (stockId) {
      params.push({ name: "_id", value: stockId });
    }
    return params;
  }, [page,stockId]);
  const { data, isLoading } = getAllStocks({
    query: queryParams,
  });
  const loadingState = isLoading ? "loading" : "idle";
  const handleApproved = async (stockId: string,stockDetailsId:string) => {
    console.log(stockId)
    const res = await updateStockApprovedStatus(stockId,stockDetailsId);
    console.log(res,'data')
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
                <div>
                  <Button color="primary" size="sm" startContent={<AddIcon/>} onPress={()=>modalUpdateStock.onOpen()}>Add</Button>
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
                       { dayjs(item.createdAt).format('MMM D, YYYY')}
                        </TableCell>
                        <TableCell>
                          <Chip color="success" variant="flat" size="sm">
                            {item.quantity}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Tooltip content={<div className="max-w-xs flex flex-wrap gap-3">
                            {
                                item.accessoryCodes.map((code,index)=><Chip isDisabled={!item.approvalDetails.isApproved} key={index} color="success" variant="flat" size="sm">
                                {code}
                              </Chip>)
                            }
                          </div>} showArrow={true}>
                            <Button color="primary" variant="flat" size="sm" radius="full">Codes</Button>
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
                                    <ListboxItem key="Unblock"   onPress={() => handleApproved(stockId!,item._id!)}>
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
                              content="Edit user"
                              showArrow
                            >
                              <Button
                                isIconOnly
                                color="primary"
                                variant="flat"
                                size="sm"
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
<UpdateStockModal useDisclosure={modalUpdateStock} stockId={stockId}/>
    </>
  );
}
