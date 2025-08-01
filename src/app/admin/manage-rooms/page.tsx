"use client";
import { AddIcon, EditIcon, InfoIcon, MoreIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import Link from "next/link";
import CreateUpdateRoomsModal from "./_components/CreateUpdateRoomsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useEffect, useMemo, useState } from "react";
import { getAllRooms } from "@/src/hooks/Room";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { TQuery } from "@/src/types";
import JULoading from "@/src/components/ui/JULoading";
import { Pagination } from "@heroui/pagination";
import { Chip } from "@heroui/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Tooltip } from "@heroui/tooltip";
import {
  updateRoomActiveStatus,
  updateRoomApprovedStatus,
} from "@/src/services/Rooms";
import { toast } from "sonner";

export default function page() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const modalForm = useDisclosure();
  const modalDetails = useDisclosure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [roomId, setRoomId] = useState("");
  const queryParams = useMemo(() => {
    const params: TQuery[] = [{ name: "page", value: page }];
    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }
    return params;
  }, [page, searchParams]);
  const { data, isLoading } = getAllRooms({
    query: queryParams,
  });
  const loadingState = isLoading ? "loading" : "idle";
  useEffect(() => {
    if (!modalForm.isOpen) {
      console.log("1s")
      setRoomId("");
    }
  }, [!modalForm.isOpen]);
  const handleActiveOrInactive = async (roomId: string, isActive: boolean) => {
    const res = await updateRoomActiveStatus(roomId, isActive);
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "roomError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  const handleApproved = async (roomId: string) => {
    const res = await updateRoomApprovedStatus(roomId);
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "roomError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">Manage Rooms</p>
        <div>
          <Button
            size="sm"
            color="primary"
            variant="ghost"
            onPress={() => modalForm.onOpen()}
            startContent={<AddIcon className="size-5 " />}
          >
            {" "}
            Add
          </Button>
        </div>
      </div>
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
          <TableColumn key="roomNo">Room No</TableColumn>
          <TableColumn key="Features">Features</TableColumn>
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
                <div className="flex flex-col gap-1">
                  <span>
                    Room No :{" "}
                    <Chip color="success" variant="flat" size="sm">
                      {item.roomNo}
                    </Chip>
                  </span>
                  <span>
                    Floor :{" "}
                    <Chip color="success" variant="flat" size="sm">
                      {item.floor}
                    </Chip>
                  </span>
                  <span>
                    Capacity :{" "}
                    <Chip color="success" variant="flat" size="sm">
                      {item.capacity}
                    </Chip>
                  </span>
                  <span>
                    Building :{" "}
                    <Chip color="success" variant="flat" size="sm">
                      {item.building}
                    </Chip>
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.features?.map((feature, index) => (
                    <Chip
                      key={index}
                      color="default"
                      variant="flat"
                      className="border border-gray-300 border-dashed"
                      size="sm"
                      radius="sm"
                    >
                      {feature}
                    </Chip>
                  ))}
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
                    color={
                      item?.approvalDetails?.isApproved ? "success" : "danger"
                    }
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
                            item?.approvalDetails?.isApproved
                              ? "Approved"
                              : "Pending",
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
                        setRoomId(item._id), modalDetails.onOpen();
                      }}
                    >
                      <InfoIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip color="primary" content="Edit Room Intro" showArrow>
                    <Button
                      isIconOnly
                      color="primary"
                      variant="flat"
                      size="sm"
                      onPress={() => {
                        setRoomId(item._id), modalForm.onOpen();
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
      <CreateUpdateRoomsModal roomId={roomId} useDisclosure={modalForm} />
    </div>
  );
}
