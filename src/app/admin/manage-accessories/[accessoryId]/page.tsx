import HeadingSection from "@/src/components/ui/HeadingSection";
import Image from "next/image";
import { Chip } from "@heroui/chip";
import { TAccessory, TCategory, TStock, TSubCategory } from "@/src/types";
import { getSingleAccessoryReq } from "@/src/services/Accessory";
import EventsHistoryTable from "../_components/EventsHistoryTable";
import Link from "next/link";
import { blankImage } from "@/src/constents";
import EditAccessoryAndUpdateStockModal from "../_components/EditAccessoryAndUpdateStockModal";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { MoreHorzIcon } from "@/src/components/icons";
import DisplaycodesCard from "../_components/DisplayCodesCard";
import DisplayQuantityCard from "../_components/DisplayQuantityCard";
import StockTable from "../_components/StockTable";

export default async function AccessoryDetailsPage({
  params,
}: {
  params: Promise<{ accessoryId: string }>;
}) {
  const { accessoryId } = await params;
  const { data: accessory } = await getSingleAccessoryReq(accessoryId);

  const acc = accessory as unknown as TAccessory;

  return (
    <div className="space-y-6">
      <HeadingSection
        title="Accessory Details"
        linkUrl="/admin/manage-accessories"
      >
        <EditAccessoryAndUpdateStockModal
          accessoryId={acc?._id!}
          stockId={(acc?.stock as TStock)?._id!}
        ></EditAccessoryAndUpdateStockModal>
      </HeadingSection>

      {/* Header with image and basic info */}
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="relative w-full md:w-2/5 h-48 md:h-72 rounded-md overflow-hidden border">
          <Image
            src={acc?.image || blankImage}
            alt={acc?.name || "Accessory image"}
            fill
            className="object-cover  hover:duration-200 hover:scale-125"
            sizes="(min-width: 768px) 40vw, 100vw"
            priority
          />
        </div>
        <div className="space-y-1 md:w-3/5">
          <h2 className="text-2xl font-semibold">{acc?.name}</h2>
          {acc?.codeTitle && (
            <p className="text-slate-600">
              <span className="font-semibold">Code Title:</span>{" "}
              {acc?.codeTitle}
            </p>
          )}
          <p className="text-slate-600">
            <span className="font-semibold">Category:</span>{" "}
            {(acc?.category as TCategory)?.name}
          </p>
          <p className="text-slate-600">
            <span className="font-semibold">Sub Category:</span>{" "}
            {(acc?.subCategory as TSubCategory)?.name}
          </p>
          <div>
            <h3 className="font-semibold">Status:</h3>
            <div className="flex flex-wrap gap-2">
              <Chip
                color={
                  acc?.status === "Low Stock" || acc?.status === "Out of Stock"
                    ? "danger"
                    : "success"
                }
                variant="flat"
                size="sm"
                radius="sm"
              >
                {acc?.status}
              </Chip>
              |{" "}
              <Chip
                color={acc?.isActive ? "success" : "danger"}
                variant="flat"
                size="sm"
                radius="sm"
              >
                {acc?.isActive ? "Active" : "Inactive"}
              </Chip>
              |{" "}
              <Chip
                color={acc?.isApproved ? "success" : "danger"}
                variant="flat"
                size="sm"
                radius="sm"
              >
                {acc?.isApproved ? "Approved" : "Not Approved"}
              </Chip>
            </div>
          </div>
        </div>
      </div>

      {/* Quantities */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DisplayQuantityCard quantity={acc?.quantityDetails?.totalQuantity} />
        <DisplayQuantityCard quantity={acc?.quantityDetails?.currentQuantity} />
        <DisplayQuantityCard
          quantity={acc?.quantityDetails?.distributedQuantity}
        />
        <DisplayQuantityCard quantity={acc?.quantityDetails?.totalQuantity} />
      </div>

      {/* Codes summary */}
      {acc?.isItReturnable && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DisplaycodesCard codes={acc?.codeDetails?.totalCodes} />
          <DisplaycodesCard codes={acc?.codeDetails?.currentCodes} />
          <DisplaycodesCard codes={acc?.codeDetails?.distributedCodes} />
          <DisplaycodesCard codes={acc?.codeDetails?.orderCodes} />
        </div>
      )}

      {/* Description */}
      {acc?.description && (
        <div>
          <h3 className="font-semibold">Description</h3>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: acc?.description }}
          />
        </div>
      )}

     
      <StockTable
        accessoryId={acc?._id!}
        stockId={(acc?.stock as TStock)?._id!}
      />
      {/* Events History */}
      {Array.isArray(acc?.eventsHistory) && acc?.eventsHistory?.length > 0 && (
        <EventsHistoryTable eventsHistory={acc?.eventsHistory} />
      )}
    </div>
  );
}
