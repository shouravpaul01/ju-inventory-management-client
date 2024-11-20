import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JUSelect from "@/src/components/form/JUSelect";
import { designationOptions } from "@/src/constents";
import { createFacultyReq } from "@/src/services/Faculty";
import { TErrorMessage } from "@/src/types";
import { facultyValidation } from "@/src/validations/faculty.validation";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@nextui-org/modal";
import { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
}
export default function CreateUpdateUserFromModal({ useDisclosure }: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<TErrorMessage[]>([]);
  const [isResetForm, setIsResetForm] = useState<boolean>(false);
  const handleCreateFaculty: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const res = await createFacultyReq(data);
    if (res?.success) {
      toast.success(res?.message);
      setIsResetForm(true);
    } else if (!res?.success && res?.errorMessages?.length > 0) {
      if (res?.errorMessages[0]?.path == "facultyError") {
        toast.error(res?.errorMessages[0]?.message);
      }
      setValidationErrors(res?.errorMessages);
    }

    setIsLoading(false);
  };
  return (
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      size="2xl"
      classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
    >
      <ModalContent>
        {(onClose) => (
          <JUForm
            onSubmit={handleCreateFaculty}
            validation={facultyValidation}
            errors={validationErrors}
            reset={isResetForm}
          >
            <ModalHeader className="flex flex-col gap-1">
              Create Faculty
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row gap-4">
                  <JUInput
                    name="name"
                    inputProps={{
                      label: "Name",
                      type: "text",
                      className: "md:w-[60%]",
                    }}
                  />
                  <JUInput
                    name="roomNo"
                    registerOptions={{ valueAsNumber: true }}
                    inputProps={{
                      label: "Room No",
                      type: "number",
                      className: "md:w-[40%]",
                    }}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <JUInput
                    name="email"
                    inputProps={{
                      label: "Email",
                      type: "email",
                      className: "md:w-[60%]",
                    }}
                  />
                  <JUSelect
                    name="designation"
                    options={designationOptions}
                    selectProps={{
                      label: "Designation",
                      placeholder: "Select Designation",
                      className: "md:w-[40%]",
                    }}
                  />
                </div>
                <JUInput
                  name="department"
                  inputProps={{
                    label: "Department",
                    defaultValue: "Computer Science and Engineering(CSE)",
                    isReadOnly: true,
                    type: "text",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary" isLoading={isLoading}>
                Submit
              </Button>
            </ModalFooter>
          </JUForm>
        )}
      </ModalContent>
    </Modal>
  );
}
