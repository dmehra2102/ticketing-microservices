import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
   process.env.JWT_KEY = 'jwtSecreyKey';
   // This will create an new instance of "MongoMemoryServer" and automatically start it
   mongod = await MongoMemoryServer.create();
   const uri = mongod.getUri();

   await mongoose.connect(uri, {});
});

afterAll(async () => {
   if (mongod) await mongod.stop();

   await mongoose.connection.close();
});

beforeEach(async () => {
   if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();

      for (let collection of collections) {
         await collection.deleteMany({});
      }
   }
});
