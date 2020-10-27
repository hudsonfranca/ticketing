import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  RequireAuth,
  ValidateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@hsftickets/common';
import stripe from '../stripe';
import Payment from '../models/payments';
import PaymentCreatedPublisher from '../events/publishers/paymentCreatedPublisher';

import Order from '../models/order';
import natsWrapper from '../natsWrapper';

const router = Router();

router.post(
  '/api/payments',
  RequireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay an ancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  },
);

export default router;
