import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
   return request(app)
      .post('/api/user/signup')
      .send({
         email: 'test@test.com',
         password: 'testPassword',
      })
      .expect(201);
});

it('returns a 400 with an invalid email', async () => {
   return request(app)
      .post('/api/user/signup')
      .send({
         email: 'testInvaidEmail',
         password: 'testInvalidPassword',
      })
      .expect(400);
});

it('returns a 400 with an invalid password', async () => {
   return request(app)
      .post('/api/user/signup')
      .send({
         email: 'testInvaidEmail',
         password: '32',
      })
      .expect(400);
});

it('returns a 400 with an missing email and password', async () => {
   return request(app).post('/api/user/signup').send({}).expect(400);
});

it('returns a 400 with an duplicate email entry', async () => {
   await request(app)
      .post('/api/user/signup')
      .send({
         email: 'test@test.com',
         password: 'testPassword',
      })
      .expect(201);

   await request(app)
      .post('/api/user/signup')
      .send({
         email: 'test@test.com',
         password: 'testPassword',
      })
      .expect(400);
});

it('sets a cookie after successful signup', async () => {
   const response = await request(app)
      .post('/api/user/signup')
      .send({
         email: 'test@test.com',
         password: 'testPassword',
      })
      .expect(201);

   expect(response.get('Set-Cookie')).toBeDefined();
});
