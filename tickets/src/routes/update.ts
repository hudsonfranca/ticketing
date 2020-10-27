import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  NotFoundError,
  RequireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@hsftickets/common';
import validateRequest from '@hsftickets/common/build/middleware/validate-request';
import TicketUpdatedPublisher from '../events/publishers/TicketUpdatedPublisher';
import natsWrapper from '../natsWrapper';
import Ticket from '../models/ticket';

const router = Router();

router.put(
  '/api/tickets/:id',
  RequireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  },
);

export default router;
