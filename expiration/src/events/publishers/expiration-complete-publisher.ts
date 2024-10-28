import {
   ExpirationCompleteEvent,
   Publisher,
   Subjects,
} from '@dmehra2102-microservices-/common';

export class ExpirationCOmpletePublisher extends Publisher<ExpirationCompleteEvent> {
   readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
