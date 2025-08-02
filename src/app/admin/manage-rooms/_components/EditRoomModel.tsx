"use client";

import { EditIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import CreateUpdateRoomsModal from "./CreateUpdateRoomsModal";

export default function EditRoomModel({ roomId }: { roomId: string }) {
  const modalForm = useDisclosure();
  return (
    <>
      <Button
        size="sm"
        color="primary"
        startContent={<EditIcon className="size-5 fill-white" />}
        onPress={() => modalForm.onOpen()}
      >
        {" "}
        Edit
      </Button>
      <CreateUpdateRoomsModal roomId={roomId} useDisclosure={modalForm} />
    </>
  );
}
