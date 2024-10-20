import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';

let mongod: MongoMemoryServer;

declare global {
   var signin: () => Promise<string[]>;
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

global.signin = async () => {
   const email = 'test@test.com';
   const password = 'testPassword';

   const response = await request(app)
      .post('/api/user/signup')
      .send({ email, password })
      .expect(201);

   const cookie = response.get('Set-Cookie');

   if (!cookie) {
      throw new Error('Failed to get cookie from response');
   }
   return cookie;
};
