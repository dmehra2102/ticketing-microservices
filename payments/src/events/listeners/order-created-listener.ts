import {
   Listener,
   OrderCreatedEvent,
   OrderStatus,
   Subjects,
} from '@dmehra2102-microservices-/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order.model';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
   queueGroupName: string = queueGroupName;
   async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
      const order = Order.build({
         id: data.id,
         price: data.ticket.price,
         status: data.status,
         userId: data.userId,
         version: data.version,
      });

      await order.save();

      msg.ack();
   }
}
