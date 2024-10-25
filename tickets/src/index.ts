import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrappper';

const start = async () => {
   if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
   }

   try {
      await natsWrapper.connect('ticketing', 'absdefg', 'http://nats-src:4222');
      natsWrapper.client.on('close', () => {
         console.log('NATS connnection closed!');
         process.exit();
      });

      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());

      await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');

      console.log('Connected to Ticket MongoDb');
   } catch (err) {
      console.error(err);
   }

   app.listen(3000, () => {
      console.log('Listening on port 3000!!!!!!!!');
   });
};

start();
