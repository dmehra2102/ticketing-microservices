import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

declare global {
   var signin: () => string[];
}

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

global.signin = () => {
   const payload = {
      email: 'test@test.com',
      password: 'testPassword',
   };

   const token = jwt.sign(payload, process.env.JWT_KEY!);

   const session = { jwt: token };

   const sessionJson = JSON.stringify(session);

   const base64 = Buffer.from(sessionJson).toString('base64');

   return [`session=${base64}`];
};
