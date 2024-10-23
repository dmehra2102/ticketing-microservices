import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import {
   currentUserMiddleware,
   requireAuthMiddleware,
   validateRequestMiddleware,
} from '@dmehra2102-microservices-/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
   '/create',
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

      res.status(201).send(ticket);
   }
);

export { router as createTicketRouter };
