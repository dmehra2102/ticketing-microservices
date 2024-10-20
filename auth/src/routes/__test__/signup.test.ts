import request from 'supertest';
import App from '../../app';

const serverInstance = new App();

it('returns a 201 on successful signup', async () => {
   return request(serverInstance.app)
      .post('/api/user/signup')
      .send({
         email: 'test@test.com',
         password: 'testPassword',
      })
      .expect(201);
});
