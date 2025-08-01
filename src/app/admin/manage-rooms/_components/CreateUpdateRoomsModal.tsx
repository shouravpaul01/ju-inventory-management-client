"use client";
import JUForm from "@/src/components/form/JUForm";
import JUInput from "@/src/components/form/JUInput";
import JULoading from "@/src/components/ui/JULoading";
import {
  departmentOptions,
  roomFeaturesOptions,
  roomTypeOptions,
} from "@/src/constents";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps,
} from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import JUSelect from "@/src/components/form/JUSelect";
import JUFileInput from "@/src/components/form/JUFileInput";

import JUTextarea from "@/src/components/form/JUTextarea";
import {
  createRoomReq,
  deleteSingleImageFromDBReq,
  updateRoomIntroReq,
} from "@/src/services/Rooms";
import { roomSchemaValidation } from "@/src/validations/room.validation";
import { TErrorMessage } from "@/src/types";
import { getSingleRoomDetails } from "@/src/hooks/Room";

import PreviewImage from "@/src/components/ui/PreviewImage";
import { features } from "process";
import JUTextEditor from "@/src/components/form/JUTextEditor";

interface IProps {
  useDisclosure: UseDisclosureProps | any;
  roomId: string;
}
export default function CreateUpdateRoomsModal({
  useDisclosure,
  roomId,
}: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [storedImges, setStoredImages] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const methods = useForm({ resolver: zodResolver(roomSchemaValidation) });

  const { data: room, isLoading: isRoomLoading } = getSingleRoomDetails(
    roomId!
  );
  console.log(room, "rrom");

  useEffect(() => {
    if (roomId) {
      methods.reset({
        roomNo: room?.roomNo || "",
        roomType: room?.roomType || "",

        department: room?.department || "",
        building: room?.building || "",
        floor: room?.floor || "",
        capacity: room?.capacity || 0,
        features: room?.features,
        description: room?.description || "",
      });
      room?.images?.length! > 0 && setStoredImages([...room?.images!]);
    } else {
      setStoredImages([]);
      setPreviewImages([]);
      methods.reset({});
    }
  }, [roomId, room, useDisclosure]);

  const handleCreateUpdate: SubmitHandler<FieldValues> = async (data) => {
    console.log(data,"formData")
    // try {
    //   console.log(data, "room");

    //   // Validate images
    //   if (storedImges?.length + previewImages?.length > 3) {
    //     methods.setError("images", { message: "Make sure to save 3 images." });
    //     return;
    //   }

    //   // Prepare form data
    //   const formData = new FormData();
    //   if (data?.images?.length > 0) {
    //     data.images.forEach((image: File) => {
    //       formData.append("images", image);
    //     });
    //   }

    //   formData.append("data", JSON.stringify(formData));
    //   setIsLoading(true);

    //   // API call
    //   const res = roomId
    //     ? await updateRoomIntroReq(roomId, formData)
    //     : await createRoomReq(formData);

    //   console.log(res, "res");

    //   // Handle response
    //   if (res?.success) {
    //     queryClient.invalidateQueries({ queryKey: ["rooms"] });
    //     queryClient.invalidateQueries({ queryKey: ["single-room"] });
    //     toast.success(res?.message);
    //     !roomId && methods.reset();
    //   } else if (!res?.success && res?.errorMessages?.length > 0) {
    //     if (res?.errorMessages[0]?.path == "roomError") {
    //       toast.error(res?.errorMessages[0]?.message);
    //       return;
    //     }

    //     res?.errorMessages?.forEach((err: TErrorMessage) => {
    //       methods.setError(err.path, { type: "server", message: err.message });
    //     });
    //   }
    // } catch (error) {
    //   console.error("Room operation failed:", error);
    //   toast.error("An unexpected error occurred");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  const handleDeleteStoredImage = async (roomId: string, imageUrl: string) => {
    const res = await deleteSingleImageFromDBReq(roomId, imageUrl);
    if (res?.success) {
      queryClient.invalidateQueries({ queryKey: ["single-room"] });
      toast.success(res?.message);
    } else if (!res?.success && res?.errorMessages?.length! > 0) {
      toast.error(res?.errorMessages![0]?.message);
    }
  };
  return (
    <Modal
      isOpen={useDisclosure.isOpen}
      onOpenChange={useDisclosure.onOpenChange}
      size="5xl"
      classNames={{ closeButton: "bg-violet-100 hover:bg-red-200" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isRoomLoading ? (
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              ) : roomId ? (
                "Update Room Info"
              ) : (
                "Create Room"
              )}
            </ModalHeader>
            {isRoomLoading ? (
              <JULoading className="h-[300px]" />
            ) : (
              <JUForm onSubmit={handleCreateUpdate} methods={methods}>
                <ModalBody>
                  <div className="space-y-2">
                    <div className="flex flex-col md:flex-row gap-4">
                      <JUInput
                        name="roomNo"
                        inputProps={{
                          label: "Room No",
                          type: "text",
                          classNames: { input: "uppercase" },
                        }}
                      />
                      <JUSelect
                        selectProps={{ label: "Room Type" }}
                        name="roomType"
                        options={roomTypeOptions}
                      />
                      <JUSelect
                        selectProps={{ label: "Department" }}
                        name="department"
                        options={departmentOptions}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <JUInput
                        name="building"
                        inputProps={{
                          label: "Building",
                          type: "text",
                        }}
                      />
                      <JUInput
                        name="floor"
                        inputProps={{
                          label: "Floor",
                          type: "text",
                          classNames: { input: "uppercase" },
                        }}
                      />

                      <JUInput
                        name="capacity"
                        inputProps={{
                          label: "Capacity",
                          type: "number",
                        }}
                        registerOptions={{ valueAsNumber: true }}
                      />
                    </div>
                    <JUSelect
                      selectProps={{
                        label: "Features",
                        selectionMode: "multiple",
                        "aria-label":"Select room features",
                        defaultSelectedKeys: [...(room?.features! || [])],
                      }}

                      name="features"
                      options={roomFeaturesOptions}
                    />
                    <div>
                      <JUFileInput
                        labelName="Images"
                        name="images"
                        maxSize={5 * 1024 * 1024}
                        accept=".jpeg, .jpg, .png"
                        onPreview={(images) => setPreviewImages(images)}
                        multiple
                      />
                      {previewImages?.length > 0 && (
                        <PreviewImage
                          heading="Preview Images"
                          previews={previewImages}
                        />
                      )}
                      {storedImges?.length > 0 && (
                        <PreviewImage
                          heading="Stored Images"
                          previews={storedImges}
                          onDelete={(imageUrl) =>
                            handleDeleteStoredImage(roomId, imageUrl)
                          }
                        />
                      )}
                    </div>
                    {/* <JUTextarea
                      textareaProps={{ label: "Description" }}
                      name="description"
                    /> */}
                    <JUTextEditor label="Description" name="description"/>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" color="primary" isLoading={isLoading}>
                    {roomId ? "Update" : "Submit"}
                  </Button>
                </ModalFooter>
              </JUForm>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
