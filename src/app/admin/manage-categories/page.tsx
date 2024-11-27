"use client"
import { AddIcon, CategoryIcon, DeleteIcon, EditIcon, InfoIcon, MoreIcon } from "@/src/components/icons";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CreateUpdateCategoryFromModal from "./_components/CreateUpdateCategoryFromModal";
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { Chip } from "@nextui-org/chip";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { TQuery } from "@/src/types";
import { getAllCategories } from "@/src/hooks/Category";
import { useQueryClient } from "@tanstack/react-query";
import JULoading from "@/src/components/ui/JULoading";
import { Tooltip } from "@nextui-org/tooltip";
import { updateCategoryActiveStatus, updateCategoryApprovedStatus } from "@/src/services/Category";
import { toast } from "sonner";



export default function ManageCategories() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const searchTerm=searchParams.get("search")
  const modalForm = useDisclosure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const queryParams = useMemo(() => {
    const params:TQuery[] = [
      { name: "page", value: page },
 
    ];
    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }
    return params;
  }, [page, tab, searchParams]);
  const { data, isLoading } = getAllCategories({
    query:queryParams,
  });
  const loadingState = isLoading ? "loading" : "idle";
  useEffect(() => {
    if (!modalForm.isOpen) {
      setCategoryId(null)
    }
  }, [modalForm.isOpen]);

  const handleActiveOrInactive=async(categoryId:string,isActive:boolean)=>{
    const res = await updateCategoryActiveStatus(categoryId, isActive);

    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "categoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  }
  const handleApproved=async(categoryId:string)=>{
    const res = await updateCategoryApprovedStatus(categoryId);
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "categoryError") {
        toast.error(res?.errorMessages[0]?.message);
      }
    }
  }
  return (
    <div>
       <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">
          {tab == "trash" ? "Trash" : "Manage Categories"}
        </p>
        <div>
          <ButtonGroup size="sm" color="primary" variant="ghost">
            <Button
              href="/admin/manage-categories"
              as={Link}
              onPress={() => modalForm.onOpen()}
              startContent={<AddIcon className="size-5 " />}
            >
              {" "}
              Add
            </Button>
            <Button
              href={
                tab == "trash"
                  ? "/admin/manage-categories"
                  : "/admin/manage-categories?tab=trash"
              }
              as={Link}
              startContent={
                tab == "trash" ? (
                  <CategoryIcon className="size-5" />
                ) : (
                  <DeleteIcon className="size-5" />
                )
              }
            >
              {tab == "trash" ? "Manage Categories" : "Trash"}
            </Button>
          </ButtonGroup>
        </div>
       
      </div> <Table
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
                  {item.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Chip color="success" variant="flat" size="sm">
                      {item?.isActive?"Active":"Inactive"}
                    </Chip>
                    
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
                            selectedKeys={[item?.isActive ? "Active":"Inactive"]}
                            disabledKeys={[item?.isActive ? "Active":"Inactive"]}
                            color="primary"
                          >
                            <ListboxItem
                              key="Active"
                              onPress={() =>handleActiveOrInactive(item._id,true)
                                
                              }
                            >
                              Active
                            </ListboxItem>
                            <ListboxItem
                              key="Inactive"
                              onPress={() =>handleActiveOrInactive(item._id,false)
                               
                              }
                            >
                              Inactive
                            </ListboxItem>
                          </Listbox>
                        </PopoverContent>
                      </Popover>
                    
                  </div>
                </TableCell>
                <TableCell>
                  {" "}
                  <div className="flex items-center gap-2">
                    <Chip
                      color={item?.isApproved ? "danger" : "success"}
                      variant="flat"
                      size="sm"
                    >
                      {item?.isApproved ? "Approved" : "Pending"}
                    </Chip>
                    {!item?.isApproved && (
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
                              item?.isApproved ? "Approved" : "Pending",
                            ]}
                            
                            color="primary"
                          >
                           
                            <ListboxItem
                              key="Unblock"
                              onPress={() =>
                                handleApproved(item._id)
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
                   
                      <Tooltip color="primary" content="Edit user" showArrow>
                        <Button
                          isIconOnly
                          color="primary"
                          variant="flat"
                          size="sm"
                          onPress={() => {
                            setCategoryId(item._id), modalForm.onOpen();
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
      <CreateUpdateCategoryFromModal categoryId={categoryId!} useDisclosure={modalForm}/>
    </div>
  )
}
