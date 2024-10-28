import Queue from 'bull';
import { Payload } from '../interface/job-queue-payload.interface';
import { ExpirationCOmpletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrappper';

const expirationQueue = new Queue<Payload>('order:expiration', {
   redis: {
      host: process.env.REDIS_HOST,
   },
});

expirationQueue.process(async (job) => {
   await new ExpirationCOmpletePublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
   });
});

export { expirationQueue };
