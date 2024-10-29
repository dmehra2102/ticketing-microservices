import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrappper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
   if (!process.env.JWT_KEY || !process.env.NATS_CLIENT_ID) {
      throw new Error('JWT_KEY and NATS_CLIENT_ID must be defined');
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

      new OrderCreatedListener(natsWrapper.client).listen();
      new OrderCancelledListener(natsWrapper.client).listen();

      await mongoose.connect('mongodb://payments-mongo-srv:27017/payments');

      console.log('Connected to Payment MongoDb');
   } catch (err) {
      console.error(err);
   }

   app.listen(3000, () => {
      console.log('Listening on port 3000!!!!!!!!');
   });
};

start();
