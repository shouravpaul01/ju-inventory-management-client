"use client"
import { AddIcon, DeleteIcon, GroupUserIcon, WidgetIcon } from '@/src/components/icons'
import { Button, ButtonGroup } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import CreateUpdateAccessoryFromModal from './_components/CreateUpdateAccessoryFromModal';

export default function ManageAccessories() {
    const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const searchTerm=searchParams.get("search")
  const modalForm = useDisclosure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [accessoryId, setAccessoryId] = useState<string | null>(null);
  return (
    <div>
     <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">
          {tab == "trash" ? "Trash" : "Manage Accessories"}
        </p>
        <div>
          <ButtonGroup size="sm" color="primary" variant="ghost">
            <Button
              href="/admin/manage-accessories"
              as={Link}
              onPress={() => modalForm.onOpen()}
              startContent={ <AddIcon className="size-5" />}
            >
              {" "}
              Add
            </Button>
            <Button
              href={
                tab == "trash"
                  ? "/admin/manage-accessories"
                  : "/admin/manage-accessories?tab=trash"
              }
              as={Link}
              startContent={
                tab == "trash" ? (
                  <WidgetIcon className="size-5" />
                ) : (
                  <DeleteIcon className="size-5" />
                )
              }
            >
              {tab == "trash" ? "Manage Accessories" : "Trash"}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <CreateUpdateAccessoryFromModal useDisclosure={modalForm}/>
    </div>
  )
}
