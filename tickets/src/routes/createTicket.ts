import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import {
   currentUserMiddleware,
   requireAuthMiddleware,
   validateRequestMiddleware,
} from '@dmehra2102-microservices-/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrappper';

const router = express.Router();

router.post(
   '/',
   currentUserMiddleware,
   requireAuthMiddleware,
   [
      body('title').not().isEmpty().withMessage('Title is Required'),
      body('price')
         .isFloat({ gt: 0 })
         .withMessage('Price must be greater than 0.'),
   ],
   validateRequestMiddleware,
   async (req: Request, res: Response) => {
      const { title, price } = req.body;

      const ticket = Ticket.build({
         title,
         price,
         userId: req.currentUser!.id,
      });
      await ticket.save();
      console.log('Hello World');
      await new TicketCreatedPublisher(natsWrapper.client).publish({
         id: ticket.id,
         title: ticket.title,
         price: ticket.price,
         userId: ticket.userId,
         version: ticket.version,
      });

      res.status(201).send(ticket);
   }
);

export { router as createTicketRouter };
