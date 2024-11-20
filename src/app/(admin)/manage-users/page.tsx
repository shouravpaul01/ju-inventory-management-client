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
import { useMemo, useState } from "react";
import { getAllFaculties } from "@/src/hooks/Faculty";
import JULoading from "@/src/components/ui/JULoading";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { MoreIcon } from "@/src/components/icons";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

export default function ManageUsers() {
  const modalForm = useDisclosure();
  const [page, setPage] = useState(1);
  const { data, isLoading } = getAllFaculties();
  const loadingState =
    isLoading || data?.data?.length === 0 ? "loading" : "idle";
  console.log(data, "data");
  return (
    <div>
      <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">Manage Users</p>
        <div>
          <ButtonGroup size="sm" color="primary" variant="ghost">
            <Button onPress={() => modalForm.onOpen()}>Add</Button>
            <Button>Trash</Button>
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
                showShadow
                color="primary"
                variant="bordered"
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
          </TableHeader>
          <TableBody
            items={data?.data ?? []}
            loadingContent={<JULoading className="h-auto" />}
            loadingState={loadingState}
          >
            {(item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <User
                    avatarProps={{ radius: "lg", src: item?.image }}
                    description={item.email}
                    name={item.name}
                  >
                    {item.email}
                  </User>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Chip>{item?.user?.role}</Chip>
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
                          selectedKeys={[item?.user?.role!]}
                          color="primary"
                        >
                          <ListboxItem key="Admin">Admin</ListboxItem>
                          <ListboxItem key="Faculty">Faculty</ListboxItem>
                        </Listbox>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
                <TableCell> <div className="flex items-center gap-2">
                    <Chip color={item?.user?.isBlocked?"danger":"success"} variant="flat">{item?.user?.isBlocked?"Block":"Unblock"}</Chip>
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
                          selectedKeys={[item?.user?.isBlocked?"Block":"Unblock"]}
                          color="primary"
                        >
                          <ListboxItem key="Block">Block</ListboxItem>
                          <ListboxItem key="Unblock">Unblock</ListboxItem>
                        </Listbox>
                      </PopoverContent>
                    </Popover>
                  </div></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CreateUpdateUserFromModal useDisclosure={modalForm} />
    </div>
  );
}
