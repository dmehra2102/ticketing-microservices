import {
   currentUserMiddleware,
   NotAuthorizedError,
   NotFoundError,
   requireAuthMiddleware,
   validateRequestMiddleware,
} from '@dmehra2102-microservices-/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrappper';

const router = express.Router();

router.put(
   '/:ticketId',
   currentUserMiddleware,
   requireAuthMiddleware,
   [
      body('title').not().isEmpty().withMessage('Title is required'),
      body('price')
         .isFloat({ gt: 0 })
         .withMessage('Price must be provided and must be greater than 0'),
   ],
   validateRequestMiddleware,
   async (req: Request, res: Response) => {
      const ticket = await Ticket.findById(req.params.ticketId);

      if (!ticket) {
         throw new NotFoundError('Ticket not found');
      }

      if (ticket.userId !== req.currentUser!.id) {
         throw new NotAuthorizedError();
      }

      ticket.set({
         title: req.body.title,
         price: req.body.price,
      });
      await ticket.save();
      await new TicketUpdatedPublisher(natsWrapper.client).publish({
         id: ticket.id,
         title: ticket.title,
         price: ticket.price,
         userId: ticket.userId,
         version: ticket.version,
      });

      res.send(ticket);
   }
);

export { router as updateTicketRoute };
