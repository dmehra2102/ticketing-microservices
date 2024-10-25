import {
   Publisher,
   Subjects,
   TicketCreatedEvent,
} from '@dmehra2102-microservices-/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
   readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
