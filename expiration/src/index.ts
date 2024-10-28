import { natsWrapper } from './nats-wrappper';

const start = async () => {
   if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined');
   }

   try {
      await natsWrapper.connect(
         'ticketing',
         process.env.NATS_CLIENT_ID,
         'http://nats-srv:4222'
      );
      natsWrapper.client.on('close', () => {
         console.log('NATS connnection closed!');
         process.exit();
      });

      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());
   } catch (err) {
      console.error(err);
   }
};

start();
