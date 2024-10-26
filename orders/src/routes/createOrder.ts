import mongoose from 'mongoose';
import { body } from 'express-validator';
import express, { NextFunction, Request, Response } from 'express';
import {
   BadRequestError,
   NotFoundError,
   OrderStatus,
   requireAuthMiddleware,
   validateRequestMiddleware,
} from '@dmehra2102-microservices-/common';
import { Ticket } from '../models/ticket.model';
import { Order } from '../models/order.model';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
   '/',
   requireAuthMiddleware,
   [
      body('ticketId')
         .not()
         .isEmpty()
         .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
         .withMessage('TicketId must be provided'),
   ],
   validateRequestMiddleware,
   async (req: Request, res: Response, next: NextFunction) => {
      const { ticketId } = req.body;

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) throw new NotFoundError('Ticket Not found.');

      //Make sure that ticket is not already reserved
      const isReserved = await ticket.isReserved();
      if (isReserved) throw new BadRequestError('Ticket is already resreved.');

      //Calculate an expiration date for this order
      const expiration = new Date();
      expiration.setSeconds(
         expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      );

      const order = Order.build({
         expiresAt: expiration,
         status: OrderStatus.CREATED,
         userId: req.currentUser!.id,
         ticket,
      });
      await order.save();

      res.status(201).send(order);
   }
);

export { router as createOrderRouter };
