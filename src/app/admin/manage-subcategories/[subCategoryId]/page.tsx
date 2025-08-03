import HeadingSection from "@/src/components/ui/HeadingSection";
import { getSingleSubCategotyReq } from "@/src/services/Sub Category";
import EditSubCategoryModel from "../_components/EditSubCategoryModel";
import EventsHistoryTable from "../_components/EventsHistoryTable";

export default async function page({
  params,
}: {
  params: Promise<{ subCategoryId: string }>;
}) {
  const { subCategoryId } = await params;
  const { data: subCategory } = await getSingleSubCategotyReq(subCategoryId);
  return (
    <div className="space-y-2">
      <HeadingSection
        title="Category Details"
        linkUrl="/admin/manage-subcategories"
      >
        <EditSubCategoryModel subCategoryId={subCategoryId} />
      </HeadingSection>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">Room No:</h3>
          <p>{subCategory?.name}</p>
        </div>
        <div>
          <h3 className="font-semibold">Room No:</h3>
          <p>{subCategory?.name}</p>
        </div>
        {subCategory?.description && (
          <div>
            <h3 className="font-semibold">Description:</h3>
            <div
              dangerouslySetInnerHTML={{ __html: subCategory?.description }}
            />
          </div>
        )}
      </div>
      <EventsHistoryTable eventsHistory={subCategory?.eventsHistory} />
    </div>
  );
}
