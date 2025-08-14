"use client";

import { EditIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import UpdateStockModal from "./UpdateStockModal";

export default function EditStockButton({
  stockId,
  stockDetailsId,
}: {
  stockId: string;
  stockDetailsId: string;
}) {
  const modalUpdateStock = useDisclosure();
  return (
    <>
      <Button
        size="sm"
        color="primary"
        startContent={<EditIcon className="size-5 fill-white" />}
        onPress={() => modalUpdateStock.onOpen()}
      >
        {" "}
        Edit Stock
      </Button>
      <UpdateStockModal
        useDisclosure={modalUpdateStock}
        stockId={stockId}
        stockDetailsId={stockDetailsId!}
      />
    </>
  );
}
