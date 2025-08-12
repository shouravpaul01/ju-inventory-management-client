"use client";
import { EditIcon, NetworkTreeIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import CreateUpdateAccessoryFromModal from "./CreateUpdateAccessoryFromModal";
import UpdateStockModal from "./UpdateStockModal";

export default function EditAccessoryAndUpdateStockModal({
  accessoryId,
  stockId,
  stockDetailsId,
}: {
  accessoryId: string;
  stockId: string;
  stockDetailsId?:string;
}) {
  const modalForm = useDisclosure();
  const modalStock = useDisclosure();
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        color="primary"
        startContent={<EditIcon className="size-5 fill-white" />}
        onPress={() => modalForm.onOpen()}
      >
        {" "}
        Edit
      </Button>
      <Button
        size="sm"
        color="primary"
        startContent={<NetworkTreeIcon className="size-5 fill-white" />}
        onPress={() => modalStock.onOpen()}
      >
        {" "}
        Stock
      </Button>
      <CreateUpdateAccessoryFromModal
        accessoryId={accessoryId!}
        useDisclosure={modalForm}
      />
      <UpdateStockModal
      useDisclosure={modalStock}
        stockId={stockId!}
     
      />
    </div>
  );
}
