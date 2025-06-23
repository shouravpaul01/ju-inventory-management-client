import { TAccessory, TOrder } from "@/src/types";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

export default function PrintOrderINV({ order }: { order?: TOrder | null }) {
  return (
    <Table
      removeWrapper
      aria-label="Example static collection table"
      className="border-collapse border border-gray-300 gap-0"
      classNames={{ thead:" outline-none" }}
      radius="none"
    >
      <TableHeader className=" border-b border-gray-300 !pb-0 ">
        <TableColumn className="!rounded-none border-r border-gray-300">NAME</TableColumn>
        <TableColumn className="border-r border-gray-300">ROLE</TableColumn>
        <TableColumn className="!rounded-none ">STATUS</TableColumn>
      </TableHeader>
      <TableBody>
        {order?.items && order.items.length > 0 ? (
          order?.items?.map((item, index) => (
            <TableRow key={index} className="border-b border-gray-300">
              <TableCell className="border-r border-gray-300">
                {" "}
                <p className=" line-clamp-2">
                  {(item.accessory as TAccessory)?.name}
                </p>
              </TableCell>
              <TableCell className="border-r border-gray-300">
               <div className="space-y-2">
                 <div className="flex gap-2">
                  <span>Expected Qty:</span>

                  <span className="font-bold">{item?.expectedQuantity}</span>
                </div>
                 <div className="flex gap-2">
                  <span>Provided Qty:</span>

                  <span className="font-bold">{item?.providedQuantity}</span>
                </div>
               </div>
              </TableCell>
              <TableCell>""</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No items found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
