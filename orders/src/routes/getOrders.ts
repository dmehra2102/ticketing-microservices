import {
   currentUserMiddleware,
   requireAuthMiddleware,
} from '@dmehra2102-microservices-/common';
import express, { NextFunction, Request, Response } from 'express';
import { Order } from '../models/order.model';

const router = express.Router();

router.get(
   '/',
   currentUserMiddleware,
   requireAuthMiddleware,
   async (req: Request, res: Response, next: NextFunction) => {
      const orders = await Order.find({
         userId: req.currentUser?.id,
      }).populate('ticket');

      res.status(200).send(orders);
   }
);

export { router as getOrdersRouter };
