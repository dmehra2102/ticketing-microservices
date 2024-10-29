import {
   BadRequestError,
   currentUserMiddleware,
   NotAuthorizedError,
   NotFoundError,
   OrderStatus,
   requireAuthMiddleware,
   validateRequestMiddleware,
} from '@dmehra2102-microservices-/common';
import { body } from 'express-validator';
import { stripe } from '../stripe';
import { Order } from '../models/order.model';
import { natsWrapper } from '../nats-wrappper';
import { Payment } from '../models/payment.model';
import express, { Request, Response } from 'express';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';

const router = express.Router();

router.post(
   '/',
   currentUserMiddleware,
   requireAuthMiddleware,
   [body('token').notEmpty(), body('orderId').notEmpty()],
   validateRequestMiddleware,
   async (req: Request, res: Response) => {
      const { token, orderId } = req.body;
      const order = await Order.findOne({ _id: orderId });

      if (!order) throw new NotFoundError('Order not found.');
      if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();
      if (order.status === OrderStatus.CANCELLED) {
         throw new BadRequestError('Cannot pay for an cancelled order');
      }

      const charge = await stripe.charges.create({
         currency: 'inr',
         amount: order.price * 100,
         source: token,
      });

      const payment = Payment.build({
         orderId: order.id,
         stripeId: charge.id,
      });
      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
         id: payment.id,
         orderId: payment.orderId,
         stripeId: payment.stripeId,
      });

      res.status(201).send({ success: true, id: payment.id });
   }
);

export { router as createPaymentRoute };
