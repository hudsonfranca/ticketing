import {
  BaseListener,
  OrderCancelledEvent,
  OrderStatus,
  subjects,
} from '@hsftickets/common';
import { Message } from 'node-nats-streaming';
import Order from '../../models/order';
import queueGroupName from './queueGroupName';

export default class OrderCancelledListener extends BaseListener<
  OrderCancelledEvent
> {
  readonly subject = subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
