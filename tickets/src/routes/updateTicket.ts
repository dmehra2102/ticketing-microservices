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

      res.send(ticket);
   }
);

export { router as updateTicketRoute };
