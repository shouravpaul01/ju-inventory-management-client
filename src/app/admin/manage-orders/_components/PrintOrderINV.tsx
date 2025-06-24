import { TAccessory, TOrder, TUser } from "@/src/types";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import dayjs from "dayjs";

export default function PrintOrderINV({ order }: { order?: TOrder | null }) {
  console.log(order,"print order");
  return (
  <div>
<div className="flex justify-between items-center mb-4">
  <div>
    <label className="text-sm font-bold">TO</label>
    <p className="text-xs text-gray-600">
   Name: <span className="font-semibold">{(order?.orderBy as TUser)?.faculty.name || "N/A"} </span>
    </p>
     <p className="text-xs text-gray-600">
   Email: <span className="font-semibold">{(order?.orderBy as TUser)?.faculty?.email || "N/A"} </span>
    </p>
     <p className="text-xs text-gray-600">
   Phone: <span className="font-semibold">{(order?.orderBy as TUser)?.faculty?.phone || "N/A"} </span>
    </p>
     <p className="text-xs text-gray-600">
   Room No: <span className="font-semibold">{(order?.orderBy as TUser)?.faculty?.roomNo || "N/A"} </span>
    </p>
  </div>
  <div>
     <p className="text-xs text-gray-600">
   Invoice: <span className="font-semibold">{order?.invoiceId || "N/A"} </span>
    </p>
 <p className="text-xs text-gray-600">
   Date: <span className="font-semibold">{dayjs(order?.orderDate).format("MMM D, YYYY") || "N/A"} </span>
    </p>
  </div>
</div>
      <Table
      removeWrapper
      aria-label="Example static collection table"
      className="border-collapse border border-gray-300"
      classNames={{ thead: " outline-none" }}
      radius="none"
    >
      <TableHeader className=" border-b border-gray-300 ">
        <TableColumn
          key="NAME"
          width={250}
          className="!rounded-none border-r border-gray-300 "
        >
          NAME
        </TableColumn>
     
        <TableColumn key="CODES"  className="border-r border-gray-300">
          Quantity-Codes
        </TableColumn>
        <TableColumn key="DEADLINE" width={120} className="!rounded-none ">
          Deadline
        </TableColumn>
      </TableHeader>
      <TableBody items={order?.items || []} emptyContent="No items found">
        {(item) => (
            <TableRow key={(item.accessory as TAccessory)?._id} className="border-b border-gray-300 text-gray-500">
              <TableCell className="border-r border-gray-300">
                <div className="space-y-2">
                  <p className=" line-clamp-2">
                    {(item.accessory as TAccessory)?.name}
                  </p>
                 <div className="flex gap-2">
                   <Chip size="sm" color="default">
                    {(item.accessory as TAccessory)?.isItReturnable
                      ? "Returnable"
                      : "Non-returnable"}
                  </Chip>
                  <Chip size="sm" color="default">
                    {item.isProvided ? "Provided" : "Not Provided"}
                  </Chip>
                 </div>
                </div>
              </TableCell>
            
              <TableCell className="border-r border-gray-300">
                <div className="flex justify-between gap-2 mb-1">
                  <div className="flex gap-2">
                    <span>Expected Qty:</span>

                    <span className="font-bold">{item?.expectedQuantity}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Provided Qty:</span>

                    <span className="font-bold">{item?.providedQuantity}</span>
                  </div>
                </div>
                {(item.providedAccessoryCodes || []).length > 0 && <div>
                <label className="text-sm ">Provided Codes:</label>
                  <div className="font-semibold">
                  {
                    item.providedAccessoryCodes.join(", ")
                }
                </div>
                </div>}
              </TableCell>
              <TableCell>
                
                  <p className="text-sm ">
                    {item.returnDeadline ? dayjs(item.returnDeadline).format("MMM D, YYYY") : "N/A"}
                  </p>
                
              </TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </Table>
  </div>
  );
}
