import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection } from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signUp(): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {

  process.env.JWT_KEY = 'replace';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await connection.db.collections();
  for (let collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  await mongo.stop();
  await connection.close();
});

global.signUp = async () => {
  const [email, password] = ['test@test.com', 'password'];
  const response = await request(app)
    .post('/api/users/sign-up')
    .send({ email, password })
    .expect(201);
  const cookie = response.get('Set-Cookie');
  return cookie;
};
