import HeadingSection from "@/src/components/ui/HeadingSection";
import { getSingleCategotyReq } from "@/src/services/Category";
import EditCategoryModel from "../_components/EditCategoryModel";
import EventsHistoryTable from "../_components/EventsHistoryTable";

export default async function page({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const { data: category } = await getSingleCategotyReq(categoryId);
  return (
    <div className="space-y-2">
      <HeadingSection
        title="Category Details"
        linkUrl="/admin/manage-categories"
      >
        <EditCategoryModel categoryId={categoryId} />
      </HeadingSection>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">Category Name:</h3>
          <p>{category?.name}</p>
        </div>
        {category?.description && (
          <div>
            <h3 className="font-semibold">Description:</h3>
            <div dangerouslySetInnerHTML={{ __html: category?.description }} />
          </div>
        )}
      </div>
      <EventsHistoryTable eventsHistory={category?.eventsHistory} />
    </div>
  );
}
