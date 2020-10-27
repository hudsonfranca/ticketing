import {
  basePublisher,
  PaymentCreatedEvent,
  subjects,
} from '@hsftickets/common';

export default class PaymentCreatedPublisher extends basePublisher<
  PaymentCreatedEvent
> {
  readonly subject = subjects.PaymentCreated;
}
