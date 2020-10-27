import { RequireAuth } from '@hsftickets/common';
import { Request, Response, Router } from 'express';
import Order from '../models/Orders';

const router = Router();

router.get('/api/orders', RequireAuth, async (req: Request, res: Response) => {
  const order = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');
  res.send(order);
});

export default router;
