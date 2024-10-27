import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import {
   Listener,
   NotFoundError,
   Subjects,
   TicketUpdatedEvent,
} from '@dmehra2102-microservices-/common';
import { Ticket } from '../../models/ticket.model';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
   readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
   queueGroupName: string = queueGroupName;

   async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
      const ticket = await Ticket.findByIdAndPrevVersion(data);
      if (!ticket) throw new NotFoundError('Ticket not found');

      const { title, price } = data;
      ticket.set({ title, price });
      await ticket.save();

      msg.ack();
   }
}
