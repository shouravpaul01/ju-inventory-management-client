"use client";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";
import CreateUpdateUserFromModal from "./_components/CreateUpdateUserFromModal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { useEffect, useMemo, useState } from "react";
import { getAllUsers, getSingleUser } from "@/src/hooks/User";
import JULoading from "@/src/components/ui/JULoading";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import {
  DeleteIcon,
  EditIcon,
  GroupUserIcon,
  InfoIcon,
  MoreIcon,
  PersonAddIcon,
  RestoreIcon,
} from "@/src/components/icons";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Tooltip } from "@nextui-org/tooltip";
import {
  deleteUserReq,
  restoreUserReq,
  updateBlockedStatusReq,
  updateUserRoleReq,
} from "@/src/services/User";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { BlobOptions } from "buffer";
import Swal from "sweetalert2";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TQuery } from "@/src/types";

export default function ManageUsers() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const searchTerm=searchParams.get("search")
  const modalForm = useDisclosure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [userId, setUerId] = useState<string | null>(null);
  useEffect(() => {
    if (!modalForm.isOpen) {
      setUerId(null);
    }
  }, [modalForm.isOpen]);
  const queryParams = useMemo(() => {
    const params:TQuery[] = [
      { name: "page", value: page },
      { name: "isDeleted", value: tab === "trash" },
    ];
    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }
    return params;
  }, [page, tab, searchParams]);
  const { data, isLoading } = getAllUsers({
    query:queryParams,
  });

  const loadingState = isLoading ? "loading" : "idle";
  const handleUpdateRole = async (userId: string, role: string) => {
    const res = await updateUserRoleReq(userId, role);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "roleError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  const handleUpdateBlockedStatus = async (
    userId: string,
    isBlocked: boolean
  ) => {
    const res = await updateBlockedStatusReq(userId, isBlocked);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "isBlocked") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6d28d9",
      cancelButtonColor: "#f31260",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const res = await deleteUserReq(userId);
      console.log(res);
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        Swal.fire({
          title: "Deleted!",
          text: `${res?.message}`,
          icon: "success",
        });
      } else if (!res?.success && res?.errorMessages?.length > 0) {
        if (res?.errorMessages[0]?.path == "isDeletedError") {
          toast.error(res?.errorMessages[0]?.message);
        }
      }
    }
  };
  const handleRestoreUser = async (userId: string) => {
    const res = await restoreUserReq(userId);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "restoreError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  };
  return (
    <div>
      <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">
          {tab == "trash" ? "Trash" : "Manage Users"}
        </p>
        <div>
          <ButtonGroup size="sm" color="primary" variant="ghost">
            <Button
              href="/admin/manage-users"
              as={Link}
              onPress={() => modalForm.onOpen()}
              startContent={<PersonAddIcon className="size-5 " />}
            >
              {" "}
              Add
            </Button>
            <Button
              href={
                tab == "trash"
                  ? "/admin/manage-users"
                  : "/admin/manage-users?tab=trash"
              }
              as={Link}
              startContent={
                tab == "trash" ? (
                  <GroupUserIcon className="size-5" />
                ) : (
                  <DeleteIcon className="size-5" />
                )
              }
            >
              {tab == "trash" ? "Manage Users" : "Trash"}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div>
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
            <TableColumn key="name">NAME</TableColumn>
            <TableColumn key="role">ROLE</TableColumn>
            <TableColumn key="status">STATUS</TableColumn>
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
                  <User
                    avatarProps={{ radius: "lg", src: item?.faculty?.image }}
                    description={
                      <div>
                        <p>ID: {item.userId}</p>
                        {item.email}
                      </div>
                    }
                    name={item?.faculty?.name}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Chip color="success" variant="flat" size="sm">
                      {item?.role}
                    </Chip>
                    {tab !== "trash" && (
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
                            selectedKeys={[item?.role!]}
                            disabledKeys={[item?.role!]}
                            color="primary"
                          >
                            <ListboxItem
                              key="Admin"
                              onPress={() =>
                                handleUpdateRole(item.userId, "Admin")
                              }
                            >
                              Admin
                            </ListboxItem>
                            <ListboxItem
                              key="Faculty"
                              onPress={() =>
                                handleUpdateRole(item.userId, "Faculty")
                              }
                            >
                              Faculty
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
                      color={item?.isBlocked ? "danger" : "success"}
                      variant="flat"
                      size="sm"
                    >
                      {item?.isBlocked ? "Block" : "Unblock"}
                    </Chip>
                    {tab !== "trash" && (
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
                              item?.isBlocked ? "Block" : "Unblock",
                            ]}
                            disabledKeys={[
                              item?.isBlocked ? "Block" : "Unblock",
                            ]}
                            color="primary"
                          >
                            <ListboxItem
                              key="Block"
                              onPress={() =>
                                handleUpdateBlockedStatus(item.userId, true)
                              }
                            >
                              Block
                            </ListboxItem>
                            <ListboxItem
                              key="Unblock"
                              onPress={() =>
                                handleUpdateBlockedStatus(item.userId, false)
                              }
                            >
                              Unblock
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
                      >
                        <InfoIcon />
                      </Button>
                    </Tooltip>
                    {tab !== "trash" && (
                      <Tooltip color="primary" content="Edit user" showArrow>
                        <Button
                          isIconOnly
                          color="primary"
                          variant="flat"
                          size="sm"
                          onPress={() => {
                            setUerId(item.userId), modalForm.onOpen();
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip
                      color={tab == "trash" ? "primary" : "danger"}
                      content={tab == "trash" ? "Restore user" : "Delete user"}
                      showArrow
                    >
                      <Button
                        isIconOnly
                        color={tab == "trash" ? "primary" : "danger"}
                        variant="flat"
                        size="sm"
                        onPress={() =>
                          tab == "trash"
                            ? handleRestoreUser(item?.userId)
                            : handleDeleteUser(item?.userId)
                        }
                      >
                        {tab == "trash" ? <RestoreIcon /> : <DeleteIcon />}
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CreateUpdateUserFromModal useDisclosure={modalForm} userId={userId!} />
    </div>
  );
}
