import { BaseListener, OrderCreatedEvent, subjects } from '@hsftickets/common';
import { Message } from 'node-nats-streaming';
import expirationQueue from '../../queues/expirationQueue';
import queueGroupName from './queue-group-name';

export default class OrderCreatedListener extends BaseListener<
  OrderCreatedEvent
> {
  readonly subject = subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log('Waiting this many milliseconds to process the job: ', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    );

    msg.ack();
  }
}
