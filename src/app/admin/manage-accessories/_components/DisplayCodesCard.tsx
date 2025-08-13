import { MoreHorzIcon } from "@/src/components/icons";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";


export default function DisplaycodesCard({codes}:{codes:string[]}) {
  return (
    <div className="px-4 py-2 rounded border">
          <p className="text-sm text-slate-600 border-b border-dashed pb-1 mb-1.5">Total Codes</p>
         {
            codes?.length>0 ?<div className="flex gap-1 flex-wrap">
            {codes?.slice(0, 6)?.map((code, index) => (
              <Chip
                key={index}
                size="sm"
                color="success"
                variant="flat"
                radius="sm"
              >
                {code}
              </Chip>
            ))}
            {codes?.length > 6 && (
              <Tooltip
                content={
                  <div className="flex gap-1 flex-wrap py-1">
                    {codes?.map((code, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        color="success"
                        variant="flat"
                        radius="sm"
                      >
                        {code}
                      </Chip>
                    ))}
                  </div>
                }
              >
                <Button isIconOnly  color="primary" variant="light" size="sm">
                  <MoreHorzIcon />
                </Button>
              </Tooltip>
            )}
          </div>:<span className="text-md text-gray-600">N/A</span>
         }
        </div>
  )
}
