import { Message } from 'node-nats-streaming';
import { BaseListener, OrderCreatedEvent, subjects } from '@hsftickets/common';
import queueGroupName from './queueGroupName';
import Order from '../../models/order';

export default class OrderCreatedListener extends BaseListener<
  OrderCreatedEvent
> {
  readonly subject = subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
