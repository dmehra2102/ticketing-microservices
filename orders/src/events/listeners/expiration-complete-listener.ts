import {
   ExpirationCompleteEvent,
   Listener,
   NotFoundError,
   OrderStatus,
   Subjects,
} from '@dmehra2102-microservices-/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order.model';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
   readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
   queueGroupName: string = this.queueGroupName;

   async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
      const order = await Order.findById(data.orderId).populate('ticket');

      if (!order) throw new NotFoundError('Order not found');

      if (order.status === OrderStatus.COMPLETE) return msg.ack();
      order.set({ status: OrderStatus.CANCELLED });
      await order.save();
      await new OrderCancelledPublisher(this.client).publish({
         id: order.id,
         ticket: { id: order.ticket.id },
         userId: order.userId,
         version: order.version,
      });

      msg.ack();
   }
}
