import HeadingSection from "@/src/components/ui/HeadingSection";
import Image from "next/image";
import Link from "next/link";
import { Chip } from "@heroui/chip";
import { blankImage } from "@/src/constents";
import { TAccessory, TEventHistory, TRoom, TStock } from "@/src/types";
import { getSingleAccessoryReq } from "@/src/services/Accessory";
import EventsHistoryTable from "../../../_components/EventsHistoryTable";
import DisplaycodesCard from "../../../_components/DisplayCodesCard";
import { Skeleton } from "@heroui/skeleton";
import { getSingleStockReq } from "@/src/services/Stock";

export default async function StockPage({
  params,
  searchParams,
}: {
  params: Promise<{ accessoryId: string; stockId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { accessoryId, stockId } = await params;
  const { details: stockDetailsId } = await searchParams;

  const { data: stock } = await getSingleStockReq(
    stockId,
    stockDetailsId as string
  );

  if (!stockDetailsId) {
    return (
      <div className="space-y-6">
        <HeadingSection
          title="Stock Detail"
          linkUrl={`/admin/manage-accessories/${accessoryId}`}
        />
        <div className="rounded-md border p-6 text-danger-500">
          Stock detail not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeadingSection
        title="Stock Detail"
        linkUrl={`/admin/manage-accessories/${accessoryId}`}
      />

      <div>
        <h4 className="text-md font-semibold border-b border-dashed pb-1 mb-2">
          Document Images
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stock?.documentImages && stock?.documentImages?.length > 0
            ? stock?.documentImages.map((src, index) => (
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

      <div>
        <h4 className="text-md font-semibold border-b border-dashed pb-1 mb-2">
          Quantity
        </h4>
        <Chip color="success" size="sm" variant="flat" radius="sm">
          {stock?.quantity}
        </Chip>
      </div>
      {stock?.accessoryCodes?.length > 0 && (
        <div>
          <h4 className="text-md font-semibold border-b border-dashed pb-1 mb-2">
            Codes
          </h4>
          <div className="flex flex-wrap gap-1">
            {stock?.accessoryCodes?.map((code, index) => (
              <Chip
                key={index}
                color="success"
                size="sm"
                variant="flat"
                radius="sm"
              >
                {code}
              </Chip>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-3">
        <h4 className="text-md font-semibold border-b border-dashed pb-1 ">
          Located details
        </h4>
        <div className="flex gap-2">
          <span className="text-md font-semibold">Room No:</span>
          <Chip color="success" variant="flat" size="md">
            {(stock?.locatedDetails?.roomNo as TRoom)?.roomNo}
          </Chip>
        </div>
        <div className="flex gap-2">
          <span className="text-md font-semibold">Place:</span>
          <span>{stock?.locatedDetails?.place || "N/A"}</span>
        </div>
        <div>
          <h4 className="text-md font-semibold border-b border-dashed pb-1 mb-2">
            Located Images
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stock?.locatedDetails?.locatedImages &&
            stock?.locatedDetails?.locatedImages?.length > 0
              ? stock?.locatedDetails?.locatedImages.map((src, index) => (
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
      </div>
      {stock?.description && (
          <div>
            <h4 className="text-md font-semibold border-b border-dashed pb-1 mb-2">Description</h4>
            <div dangerouslySetInnerHTML={{ __html: stock?.description }} />
          </div>
        )}
         {/* Events History */}
      {Array.isArray(stock?.eventsHistory) && stock?.eventsHistory?.length > 0 && (
        <EventsHistoryTable eventsHistory={stock?.eventsHistory } />
      )}
    </div>
  );
}
