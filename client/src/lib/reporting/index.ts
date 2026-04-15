import { TRACKING_CONFIG } from "@/lib/tracking/config";
import type { TrackingEvent } from "@/lib/tracking/types";

const inMemoryQueue: TrackingEvent[] = [];

export function queueReportingEvent(event: TrackingEvent) {
  inMemoryQueue.push(event);

  if (inMemoryQueue.length > 100) {
    inMemoryQueue.shift();
  }

  if (TRACKING_CONFIG.debug) {
    console.info("[tracking]", event.event_name, event);
  }
}

export function getQueuedReportingEvents() {
  return [...inMemoryQueue];
}
