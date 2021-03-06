import mongoose from 'mongoose';
import { OrderStatus, OrderCancelledEvent } from '@hsftickets/common';
import { Message } from 'node-nats-streaming';
import natsWrapper from '../../../natsWrapper';
import OrderCancelledListener from '../orderCancelledListener';
import Order from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'hfhfhfh',
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'djdjdj',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('Updates the status of the order', async () => {
  const { data, listener, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('Acks the message', async () => {
  const { data, listener, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
