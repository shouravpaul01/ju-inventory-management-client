import HeadingSection from "@/src/components/ui/HeadingSection";
import Image from "next/image";
import { Chip } from "@heroui/chip";
import { TAccessory, TCategory, TStock, TSubCategory } from "@/src/types";
import { getSingleAccessoryReq } from "@/src/services/Accessory";
import EventsHistoryTable from "../_components/EventsHistoryTable";
import Link from "next/link";
import { blankImage } from "@/src/constents";
import EditAccessoryAndUpdateStockModal from "../_components/EditAccessoryAndUpdateStockModal";

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
        <EditAccessoryAndUpdateStockModal accessoryId={acc?._id!} stockId={(acc?.stock as TStock)?._id!}></EditAccessoryAndUpdateStockModal>
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
        <div className="p-4 rounded border">
          <p className="text-sm text-slate-600">Total Qty</p>
          <p className="text-xl font-semibold">
            {acc?.quantityDetails?.totalQuantity ?? 0}
          </p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-slate-600">Current Qty</p>
          <p className="text-xl font-semibold">
            {acc?.quantityDetails?.currentQuantity ?? 0}
          </p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-slate-600">Distributed Qty</p>
          <p className="text-xl font-semibold">
            {acc?.quantityDetails?.distributedQuantity ?? 0}
          </p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-slate-600">Order Qty</p>
          <p className="text-xl font-semibold">
            {acc?.quantityDetails?.orderQuantity ?? 0}
          </p>
        </div>
      </div>

      {/* Codes summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded border">
          <p className="text-sm text-slate-600">Total Codes</p>
          <p className="text-xl font-semibold">
            {acc?.codeDetails?.totalCodes?.length ?? 0}
          </p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-slate-600">Current Codes</p>
          <p className="text-xl font-semibold">
            {acc?.codeDetails?.currentCodes?.length ?? 0}
          </p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-slate-600">Distributed Codes</p>
          <p className="text-xl font-semibold">
            {acc?.codeDetails?.distributedCodes?.length ?? 0}
          </p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-slate-600">Ordered Codes</p>
          <p className="text-xl font-semibold">
            {acc?.codeDetails?.orderCodes?.length ?? 0}
          </p>
        </div>
      </div>

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

      {/* Link to Stock details page */}
      <div>
        <Link
          href={`/admin/manage-accessories/${acc?._id}/stock/${(acc?.stock as TStock)?._id}`}
          className="text-primary hover:underline"
        >
          View Stock Details →
        </Link>
      </div>

      {/* Events History */}
      {Array.isArray(acc?.eventsHistory) && acc?.eventsHistory?.length > 0 && (
        <EventsHistoryTable eventsHistory={acc?.eventsHistory} />
      )}
    </div>
  );
}
