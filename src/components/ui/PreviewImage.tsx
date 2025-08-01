import { Button } from "@heroui/button";
import Image from "next/image";
import { XmarkIcon } from "../icons";

type PreviewProps = {
  previews: string[];
  heading?: string;
  onDelete?: (imageUrl: string, index: number) => void; // Add onDelete handler prop
};

export default function PreviewImage({
  previews,
  heading = "Preview Images",
  onDelete,
}: PreviewProps) {
  return (
    <div className="space-y-2">
      {heading && <h4 className="text-md text-gray-500">{heading}</h4>}

      <div className="flex flex-wrap gap-4">
        {previews.map((url, index) => (
          <div key={index} className="relative group">
            <Image
              src={url}
              alt={`Preview ${index + 1}`}
              width={144}
              height={144}
              className="border border-dashed border-primary rounded-md p-1 object-cover"
              style={{
                width: "144px",
                height: "144px",
              }}
            />

            {/* Delete button */}
            {onDelete && (
              <Button
                isIconOnly
                onPress={() => onDelete(url, index)}
                color="default"
                size="sm"
                radius="full"
                className="absolute -top-2 -right-2"
              >
                <XmarkIcon />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
