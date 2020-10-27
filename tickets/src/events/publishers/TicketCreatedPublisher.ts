import {
  basePublisher,
  subjects,
  TicketCreatedEvent,
} from '@hsftickets/common';

export default class TicketCreatedPublisher extends basePublisher<
  TicketCreatedEvent
> {
  readonly subject = subjects.TicketCreated;
}
