import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@hsftickets/common';
import { Message } from 'node-nats-streaming';
import TicketCreatedListener from '../ticketCreatedLister';
import natsWrapper from '../../../natsWrapper';
import Ticket from '../../../models/Ticket';

const setup = async () => {
  // create an instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Creates an saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('Acks the message', async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
