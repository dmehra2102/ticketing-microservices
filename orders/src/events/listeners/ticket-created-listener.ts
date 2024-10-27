import {
   Listener,
   Subjects,
   TicketCreatedEvent,
} from '@dmehra2102-microservices-/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket.model';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
   readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
   queueGroupName: string = queueGroupName;
   async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
      const { id, title, price } = data;
      const ticket = Ticket.build({
         id,
         title,
         price,
      });

      await ticket.save();

      msg.ack();
   }
}
