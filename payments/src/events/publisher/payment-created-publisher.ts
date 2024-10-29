import {
   Publisher,
   Subjects,
   PaymentCreatedEvent,
} from '@dmehra2102-microservices-/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
   subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
