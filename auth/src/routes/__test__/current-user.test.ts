import { app } from '../../app';
import request from 'supertest';

it('respond with a details abbout the current user', async () => {
   const cookie = await global.signin();

   const response = await request(app)
      .get('/api/user/current-user/details')
      .set('Cookie', cookie)
      .send()
      .expect(200);

   expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
   const response = await request(app)
      .get('/api/user/current-user/details')
      .send()
      .expect(200);

   expect(response.body.currentUser).toEqual(null);
});
