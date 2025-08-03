"use client";

import { EditIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import CreateUpdateCategoryFromModal from "./CreateUpdateCategoryFromModal";

export default function EditCategoryModel({ categoryId }: { categoryId: string }) {
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
      <CreateUpdateCategoryFromModal categoryId={categoryId} useDisclosure={modalForm} />
    </>
  );
}
