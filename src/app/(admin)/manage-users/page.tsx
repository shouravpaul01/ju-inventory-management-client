"use client";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";
import CreateUpdateUserFromModal from "./_components/CreateUpdateUserFromModal";

export default function ManageUsers() {
  const modalForm = useDisclosure();
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
      <CreateUpdateUserFromModal useDisclosure={modalForm}/>
    </div>
  );
}
