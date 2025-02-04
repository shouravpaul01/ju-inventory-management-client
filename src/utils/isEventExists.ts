import { TEvents, TOrderEvent } from "../types";


export default function isEventExists({events,checkEvent}:{events:TOrderEvent[],checkEvent:TEvents}) {
  const isExistsEvent=events?.map(element=>element.event)?.includes(checkEvent)
 return isExistsEvent
}
