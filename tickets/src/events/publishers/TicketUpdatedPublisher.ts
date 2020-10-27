import {
  basePublisher,
  subjects,
  TicketUpdatedEvent,
} from '@hsftickets/common';

export default class TicketUpdatedPublisher extends basePublisher<
  TicketUpdatedEvent
> {
  readonly subject = subjects.TicketUpdated;
}
