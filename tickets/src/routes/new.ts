import { Request, Response, Router } from 'express';
import { RequireAuth, ValidateRequest } from '@hsftickets/common';
import { body } from 'express-validator';
import Ticket from '../models/ticket';
import TicketCreatedPublisher from '../events/publishers/TicketCreatedPublisher';
import natsWrapper from '../natsWrapper';

const router = Router();

router.post(
  '/api/tickets',
  RequireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  },
);

export default router;
