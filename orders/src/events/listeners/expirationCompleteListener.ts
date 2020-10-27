import {
  BaseListener,
  ExpirationCompleteEvent,
  subjects,
  OrderStatus,
} from '@hsftickets/common';
import { Message } from 'node-nats-streaming';
import queueGroupName from './queueGroupName';
import Order from '../../models/Orders';
import OrderCancelledPublisher from '../publishers/OrderCancelledPublisher';

export default class ExpirationCompleteListener extends BaseListener<
  ExpirationCompleteEvent
> {
  queueGroupName = queueGroupName;

  readonly subject = subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
