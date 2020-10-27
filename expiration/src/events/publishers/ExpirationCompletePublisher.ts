import {
  subjects,
  basePublisher,
  ExpirationCompleteEvent,
} from '@hsftickets/common';

export default class ExpirationCompletePublisher extends basePublisher<
  ExpirationCompleteEvent
> {
  readonly subject = subjects.ExpirationComplete;
}
