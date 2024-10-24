import { Ticket } from '../models/ticket';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('', async (req: Request, res: Response) => {
   const tickets = await Ticket.find({});
   res.send(tickets);
});

export { router as getAllTicketsRouter };
