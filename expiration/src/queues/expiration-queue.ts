import Queue from 'bull';
import { Payload } from '../interface/job-queue-payload.interface';

const expirationQueue = new Queue<Payload>('order:expiration', {
   redis: {
      host: process.env.REDIS_HOST,
   },
});

expirationQueue.process(async (job) => {
   console.log(
      'I want to pulish an expiration:complete event.',
      job.data.orderId
   );
});

export { expirationQueue };
