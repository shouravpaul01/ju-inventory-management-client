"use client"
import JULoading from "@/src/components/ui/JULoading";
import { TFaculty, TRoomEventHistory } from "@/src/types";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import dayjs from "dayjs";
export default function EventsHistoryTable({eventsHistory}:{eventsHistory:TRoomEventHistory[]}) {
  return (
    <div className="space-y-2 mt-5">
        <h3 className="font-semibold">Events History</h3>
      <Table
        aria-label="Example table with client side pagination"
        removeWrapper
        shadow="none"
        
        classNames={{
          wrapper: "min-h-[222px] ",
          tr:"border-b"
        }}
      >
        <TableHeader>
          <TableColumn key="roomNo">Event</TableColumn>
          <TableColumn key="Features">Performed By</TableColumn>
          <TableColumn key="status">Performed Date</TableColumn>
          <TableColumn key="approval">Comments</TableColumn>
      
        </TableHeader>
        <TableBody
          items={eventsHistory ?? []}
          loadingContent={<JULoading className="h-auto" />}
        //   loadingState={eventLoadingState}
          // emptyContent={<p>Data not found.</p>}
        >
          {(event) => (
            <TableRow key={event._id}>
              <TableCell>
                {event.eventType?.toUpperCase()}
              </TableCell>
              <TableCell>
                {(event?.performedBy as TFaculty)?.name}
              </TableCell>
              <TableCell>
                
                {dayjs(event.performedAt).format("MMM D, YYYY h:mm A")}
              </TableCell>
              <TableCell>
                <p className="line-clamp-2">{event.comments}</p>
              </TableCell>
              
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
  )
}
