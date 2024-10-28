import {
   currentUserMiddleware,
   NotAuthorizedError,
   NotFoundError,
   requireAuthMiddleware,
} from '@dmehra2102-microservices-/common';
import { Order } from '../models/order.model';
import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.get(
   '/:orderId',
   currentUserMiddleware,
   requireAuthMiddleware,
   async (req: Request, res: Response, next: NextFunction) => {
      const order = await Order.findById(req.params.orderId).populate('ticket');

      if (!order) throw new NotFoundError('Order not found');
      if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

      res.send(order);
   }
);

export { router as getOrderRouter };
