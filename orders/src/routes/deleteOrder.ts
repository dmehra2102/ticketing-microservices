import {
   NotAuthorizedError,
   NotFoundError,
   OrderStatus,
   requireAuthMiddleware,
} from '@dmehra2102-microservices-/common';
import express, { NextFunction, Request, Response } from 'express';
import { Order } from '../models/order.model';

const router = express.Router();

router.delete(
   '/:orderId',
   requireAuthMiddleware,
   async (req: Request, res: Response, next: NextFunction) => {
      const order = await Order.findById(req.params.orderId).populate('ticket');

      if (!order) throw new NotFoundError('Order not found');
      if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

      order.status = OrderStatus.CANCELLED;
      await order.save();

      res.status(204).send(order);
   }
);

export { router as deleteOrderRouter };
