import {
   NotAuthorizedError,
   NotFoundError,
   OrderStatus,
   requireAuthMiddleware,
} from '@dmehra2102-microservices-/common';
import express, { NextFunction, Request, Response } from 'express';
import { Order } from '../models/order.model';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrappper';

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

      new OrderCancelledPublisher(natsWrapper.client).publish({
         id: order.id,
         userId: order.userId,
         ticket: { id: order.ticket.id },
      });

      res.status(204).send(order);
   }
);

export { router as deleteOrderRouter };
