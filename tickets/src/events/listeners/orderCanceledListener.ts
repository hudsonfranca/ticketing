import {
  BaseListener,
  OrderCancelledEvent,
  subjects,
} from '@hsftickets/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket';
import queueGroupName from './queueGroupName';
import TicketUpdatedPublisher from '../publishers/TicketUpdatedPublisher';

export default class OrderCancelledListener extends BaseListener<
  OrderCancelledEvent
> {
  readonly subject = subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
