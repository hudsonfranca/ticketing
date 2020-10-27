import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@hsftickets/common';
import { Message } from 'node-nats-streaming';
import TicketUpdatedListener from '../ticketUpdatedListeners';
import natsWrapper from '../../../natsWrapper';
import Ticket from '../../../models/Ticket';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'New concert',
    price: 999,
    userId: 'kdkkdkkdkddk',
  };

  // Create a feke msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // Return all of this stuff
  return { msg, data, ticket, listener };
};

it('Finds, updates, and saves a ticket', async () => {
  const { data, msg, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('Acs the message', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('Does not ack if the event has a skipped version nu,ber', async () => {
  const { data, msg, ticket, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
