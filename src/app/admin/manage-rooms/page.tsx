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
import { Switch } from "@heroui/switch";
import HeadingSection from "@/src/components/ui/HeadingSection";

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
  const { data, isLoading, refetch } = getAllRooms({
    query: queryParams,
  });
  const loadingState = isLoading ? "loading" : "idle";
  useEffect(() => {
    if (!modalForm.isOpen) {
      console.log("1s");
      setRoomId("");
    }
  }, [!modalForm.isOpen]);
  const handleActiveOrInactive = async (roomId: string, isActive: boolean) => {
    const res = await updateRoomActiveStatus(roomId, isActive);

    if (res?.success) {
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "roomError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  };
  const handleApproved = async (roomId: string) => {
    const res = await updateRoomApprovedStatus(roomId);
    if (res?.success) {
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "roomError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  };
  return (
    <div className="space-y-4">
    
      <HeadingSection title="Manage rooms" > 
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

                  {item?.isApproved && (
                    <Tooltip
                      content={
                        item?.isActive
                          ? "Deactivate this room? Click to proceed."
                          : "Activate this room? Click to proceed."
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
                    <Tooltip content="Do you confirm the approval of this room? Please click to proceed.">
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
                      href={`/admin/manage-rooms/${item?._id!}`}
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
                        setRoomId(item._id!), modalForm.onOpen();
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
