import { basePublisher, OrderCreatedEvent, subjects } from '@hsftickets/common';

export default class OrderCreatedPublisher extends basePublisher<
  OrderCreatedEvent
> {
  readonly subject = subjects.OrderCreated;
}
