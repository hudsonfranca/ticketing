import Ticket from '../ticket';

it('Implements optmistic concurrency control', async done => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separete changes to the tickets we fetched
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  // Save the first fetched ticket
  await firstInstance?.save();

  // Save the second feched ticket ans expect an error
  try {
    await secondInstance?.save();
  } catch (error) {
    return done();
  }

  throw new Error('Should not reach thie point');
});

it('Increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
