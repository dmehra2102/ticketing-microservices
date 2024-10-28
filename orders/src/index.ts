import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrappper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';

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

      // Initializing Listener
      new TicketCreatedListener(natsWrapper.client).listen();
      new TicketUpdatedListener(natsWrapper.client).listen();
      new ExpirationCompleteListener(natsWrapper.client).listen();

      await mongoose.connect('mongodb://orders-mongo-srv:27017/orders');
      console.log('Connected to Orders MongoDb');
   } catch (err) {
      console.error(err);
   }

   app.listen(3000, () => {
      console.log('Listening on port 3000!!!!!!!!');
   });
};

start();
