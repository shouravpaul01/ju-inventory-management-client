import { EditIcon } from "@/src/components/icons";
import HeadingSection from "@/src/components/ui/HeadingSection";
import JULoading from "@/src/components/ui/JULoading";
import { blankImage } from "@/src/constents";

import { getSingleRoomReq } from "@/src/services/Rooms";
import { TFaculty } from "@/src/types";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";

import Image from "next/image";
import EventsHistoryTable from "../_components/EventsHistoryTable";
import EditRoomModel from "../_components/EditRoomModel";

export default async function page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  
  const { data: room } = await getSingleRoomReq(roomId);
 
  
  return (
    <>
    <div className="space-y-2">
      <HeadingSection title="Room Details" linkUrl="/admin/manage-rooms">
        <EditRoomModel roomId={roomId}/>
      </HeadingSection>
      <div className="space-y-6">
        {/* Images */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room.images && room.images.length > 0
              ? room.images.map((src, index) => (
                  <div
                    key={index}
                    className="relative w-full h-40 rounded overflow-hidden shadow"
                  >
                    <Image
                      src={src}
                      alt={`Room image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                ))
              : [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="relative w-full h-40 rounded overflow-hidden"
                  >
                    <Skeleton className="absolute inset-0 w-full h-full" />
                    <Image
                      src="/blank-image.png"
                      alt="No image"
                      fill
                      className="object-contain z-10"
                      style={{ background: "#f3f3f3" }}
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* Room Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Room No:</h3>
            <p>{room.roomNo}</p>
          </div>
          <div>
            <h3 className="font-semibold">Building:</h3>
            <p>{room.building}</p>
          </div>
          <div>
            <h3 className="font-semibold">Floor:</h3>
            <p>{room.floor}</p>
          </div>
          <div>
            <h3 className="font-semibold">Room Type:</h3>
            <p>{room.roomType}</p>
          </div>
          <div>
            <h3 className="font-semibold">Capacity:</h3>
            <p>{room.capacity}</p>
          </div>
          <div>
            <h3 className="font-semibold">Department:</h3>
            <p>{room.department}</p>
          </div>
          <div>
            <h3 className="font-semibold">Assigned Room (Faculty):</h3>
            <p>{(room.assignedRoom as TFaculty)?.name || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Status:</h3>
            <div className="flex flex-wrap gap-2">
            <Chip
                 
                  color={room.isActive ? "success":"danger"}
                  variant="flat"
                  
                  size="sm"
                  radius="sm"
                >
                 {room.isActive ? "Active" : "Inactive"} 
                </Chip>
                |{" "}
                <Chip
                 
                 color={room.isApproved ? "success":"danger"}
                 variant="flat"
                 
                 size="sm"
                 radius="sm"
               >
                {room.isApproved ? "Approved" : "Not Approved"} 
               </Chip>
               |{" "}
               <Chip
                 
                 color={room.isDeleted ? "success":"danger"}
                 variant="flat"
                 
                 size="sm"
                 radius="sm"
               >
                {room.isDeleted ? "Deleted" : "Not Deleted"}
               </Chip>
              
            </div>
          </div>
        </div>

        {/* Description */}
        {room.description && (
          <div>
            <h3 className="font-semibold">Description:</h3>
            <p>{room.description}</p>
          </div>
        )}

        {/* Features */}
        <div>
          <h3 className="font-semibold">Features:</h3>
          <div className="flex flex-wrap gap-3">
            {room.features && room.features.length > 0 ? (
              room.features.map((feature, index) => (
                <Chip
                  key={index}
                  color="default"
                  variant="flat"
                  className="border border-gray-300 border-dashed"
                  size="sm"
                  radius="sm"
                >
                  {feature}
                </Chip>
              ))
            ) : (
              <span>No features listed</span>
            )}
          </div>
        </div>
        {/* Description */}
        {room.description && (
          <div>
            <h3 className="font-semibold">Description:</h3>
            <div dangerouslySetInnerHTML={{ __html: room.description }} />
          </div>
        )}
      </div>
      <EventsHistoryTable eventsHistory={room?.eventsHistory!}/>
    </div>
    
    </>
  );
}
