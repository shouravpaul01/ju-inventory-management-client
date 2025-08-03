"use client";

import { EditIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import CreateUpdateUserFromModal from "../../manage-users/_components/CreateUpdateUserFromModal";
import CreateUpdateSubCategoryFromModal from "./CreateUpdateSubCategoryFromModal";

export default function EditSubCategoryModel({ subCategoryId }: { subCategoryId: string }) {
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
      <CreateUpdateSubCategoryFromModal subCategoryId={subCategoryId} useDisclosure={modalForm} />
    </>
  );
}
