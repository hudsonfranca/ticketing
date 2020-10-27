import { Request, Response, Router } from 'express';
import { RequireAuth, OrderStatus, NotFoundError } from '@hsftickets/common';
import Order from '../models/Orders';
import OrderCancelledPublisher from '../events/publishers/OrderCancelledPublisher';
import natsWrapper from '../natsWrapper';

const router = Router();

router.delete(
  '/api/orders/:orderId',
  RequireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotFoundError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    // Publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  },
);

export default router;
