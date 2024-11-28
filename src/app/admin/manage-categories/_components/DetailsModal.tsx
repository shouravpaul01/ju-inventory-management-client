import JULoading from "@/src/components/ui/JULoading";
import { getSingleCategory } from "@/src/hooks/Category";
import { Chip } from "@nextui-org/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@nextui-org/modal";
import { Skeleton } from "@nextui-org/skeleton";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  categoryId: string;
}
export default function DetailsModal({ useDisclosure, categoryId }: IProps) {
  const { data: category, isLoading: isCategoryLoading } = getSingleCategory(
    categoryId!
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
              {isCategoryLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : (
                "Category Details"
              )}
            </ModalHeader>
           {isCategoryLoading? <JULoading className="h-[300px]" />:<ModalBody>
              <p>
                {" "}
                <span className="font-bold me-1">Name:</span>
                {category?.name}
              </p>
              <p>
                {" "}
                <span className="font-bold me-1">Description:</span>
                {category?.description}
              </p>
              
              <p>
                {" "}
                <span className="font-bold me-1">Status:</span>{" "}
                <Chip
                  color={category?.isActive ? "success" : "danger"}
                  variant="flat"
                  size="sm"
                >
                  {category?.isActive ? "Active" : "Inactive"}
                </Chip>
              </p>
              <p>
                {" "}
                <span className="font-bold me-1">Approval:</span>{" "}
                <Chip
                  color={category?.isApproved ? "success" : "danger"}
                  variant="flat"
                  size="sm"
                >
                  {category?.isApproved ? "Approved" : "Pending"}
                </Chip>
              </p>
            </ModalBody>}
            <ModalFooter>
                  
                </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
