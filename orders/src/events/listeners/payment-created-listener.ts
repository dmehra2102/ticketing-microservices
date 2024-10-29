import {
   Listener,
   NotFoundError,
   OrderStatus,
   PaymentCreatedEvent,
   Subjects,
} from '@dmehra2102-microservices-/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order.model';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
   readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
   queueGroupName: string = queueGroupName;
   async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
      const order = await Order.findById(data.orderId);

      if (!order) throw new NotFoundError('Order not found');

      order.set({ status: OrderStatus.COMPLETE });
      await order.save();

      msg.ack();
   }
}
