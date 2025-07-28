"use client"
import { AddIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import Link from "next/link";
import CreateUpdateRoomsModal from "./_components/CreateUpdateRoomsModal";


export default function page() {
     const modalForm = useDisclosure();
  return (
    <div>
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
      </div>{" "}
      <CreateUpdateRoomsModal categoryId="d" useDisclosure={modalForm}/>
    </div>
  )
}
