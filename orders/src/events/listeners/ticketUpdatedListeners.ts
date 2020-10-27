import { Message } from 'node-nats-streaming';
import { subjects, BaseListener, TicketUpdatedEvent } from '@hsftickets/common';
import Ticket from '../../models/Ticket';
import queueGroupName from './queueGroupName';

export default class TicketUpdatedListener extends BaseListener<
  TicketUpdatedEvent
> {
  readonly subject = subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}
