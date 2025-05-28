import JULoading from "@/src/components/ui/JULoading";
import { getSingleSubCategory } from "@/src/hooks/Sub Category";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  subCategoryId: string;
}
export default function DetailsModal({ useDisclosure, subCategoryId }: IProps) {
  const { data: subCategory, isLoading: isSubCategoryLoading } = getSingleSubCategory(
    subCategoryId!
  );
  return (
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      size="xl"
      classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isSubCategoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : (
                "Sub Category Details"
              )}
            </ModalHeader>
            {
              isSubCategoryLoading ?<JULoading className="h-[300px]" />:<ModalBody>
              <p>
                {" "}
                <span className="font-bold me-1">Name:</span>
                {subCategory?.name}
              </p>
              <p>
                {" "}
                <span className="font-bold me-1">Category:</span>
                {subCategory?.category.name}
              </p>
              <p>
                {" "}
                <span className="font-bold me-1">Description:</span>
                {subCategory?.description}
              </p>
              
              <p>
                {" "}
                <span className="font-bold me-1">Status:</span>{" "}
                <Chip
                  color={subCategory?.isActive ? "success" : "danger"}
                  variant="flat"
                  size="sm"
                >
                  {subCategory?.isActive ? "Active" : "Inactive"}
                </Chip>
              </p>
              <p>
                {" "}
                <span className="font-bold me-1">Approval:</span>{" "}
                <Chip
                  color={subCategory?.isApproved ? "success" : "danger"}
                  variant="flat"
                  size="sm"
                >
                  {subCategory?.isApproved ? "Approved" : "Pending"}
                </Chip>
              </p>
            </ModalBody>
            }
            <ModalFooter>
                  
                </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
