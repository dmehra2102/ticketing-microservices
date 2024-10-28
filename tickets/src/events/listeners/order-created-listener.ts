import {
   Listener,
   NotFoundError,
   OrderCreatedEvent,
   Subjects,
} from '@dmehra2102-microservices-/common';
import { Ticket } from '../../models/ticket';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
   queueGroupName: string = queueGroupName;
   async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
      const ticket = await Ticket.findById(data.ticket.id);

      if (!ticket) throw new NotFoundError('Ticket Not found');

      ticket.set({ orderId: data.id });

      await ticket.save();
      await new TicketUpdatedPublisher(this.client).publish({
         id: ticket.id,
         price: ticket.price,
         title: ticket.title,
         userId: ticket.userId,
         orderId: ticket.orderId,
         version: ticket.version,
      });

      msg.ack();
   }
}
