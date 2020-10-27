import {
  basePublisher,
  OrderCancelledEvent,
  subjects,
} from '@hsftickets/common';

export default class OrderCancelledPublisher extends basePublisher<
  OrderCancelledEvent
> {
  readonly subject = subjects.OrderCancelled;
}
