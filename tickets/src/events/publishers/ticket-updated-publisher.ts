import {
   Publisher,
   Subjects,
   TicketUpdatedEvent,
} from '@dmehra2102-microservices-/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
   readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
