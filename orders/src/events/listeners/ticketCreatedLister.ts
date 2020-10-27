import { Message } from 'node-nats-streaming';
import { subjects, BaseListener, TicketCreatedEvent } from '@hsftickets/common';
import Ticket from '../../models/Ticket';
import queueGroupName from './queueGroupName';

export default class TicketCreatedListener extends BaseListener<
  TicketCreatedEvent
> {
  readonly subject = subjects.TicketCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
