import { natsWrapper } from './nats-wrappper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
   if (
      !process.env.NATS_CLUSTER_ID ||
      !process.env.NATS_URL ||
      !process.env.NATS_CLIENT_ID
   ) {
      throw new Error(
         'NATS_CLIENT_ID and NATS_CLUSTER_ID and NATS_URL must be defined'
      );
   }

   try {
      await natsWrapper.connect(
         process.env.NATS_CLUSTER_ID,
         process.env.NATS_CLIENT_ID,
         process.env.NATS_URL
      );
      natsWrapper.client.on('close', () => {
         console.log('NATS connnection closed!');
         process.exit();
      });

      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());

      new OrderCreatedListener(natsWrapper.client).listen();
   } catch (err) {
      console.error(err);
   }
};

start();
