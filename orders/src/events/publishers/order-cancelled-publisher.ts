import {
   OrderCancelledEvent,
   Publisher,
   Subjects,
} from '@dmehra2102-microservices-/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
   readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
