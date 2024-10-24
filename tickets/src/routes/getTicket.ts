import { Ticket } from '../models/ticket';
import express, { Request, Response } from 'express';
import { NotFoundError } from '@dmehra2102-microservices-/common';

const router = express.Router();

router.get('/:ticketId', async (req: Request, res: Response) => {
   const ticket = await Ticket.findById(req.params.ticketId);

   if (!ticket) throw new NotFoundError('Ticket not found');

   res.status(200).send(ticket);
});

export { router as getTicketRouter };
