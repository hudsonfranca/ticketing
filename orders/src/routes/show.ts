import {
  NotAuthorizedError,
  NotFoundError,
  RequireAuth,
} from '@hsftickets/common';
import { Request, Response, Router } from 'express';
import Order from '../models/Orders';

const router = Router();

router.get(
  '/api/orders/:orderId',
  RequireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.send(order);
  },
);

export default router;
