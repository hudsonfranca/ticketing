import mongoose from 'mongoose';
import { Request, Response, Router } from 'express';
import {
  NotFoundError,
  RequireAuth,
  ValidateRequest,
  OrderStatus,
  BadRequestError,
} from '@hsftickets/common';
import { body } from 'express-validator';
import Ticket from '../models/Ticket';
import Order from '../models/Orders';
import OrderCreatedPublisher from '../events/publishers/OrderCreatedPublisher';
import natsWrapper from '../natsWrapper';

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/orders',
  RequireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket must be provided'),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // Make sure that this ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // If we find an order from that mens the ticket *is* reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is alread reserved');
    }

    // Calculate an expiration data for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  },
);

export default router;
