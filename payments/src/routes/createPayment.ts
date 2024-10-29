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
import express, { Request, Response } from 'express';
import { Order } from '../models/order.model';

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
   }
);

export { router as createPaymentRoute };
