import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signIn(): string[];
    }
  }
}

let mongo: any;
beforeAll(async () => {

  process.env.JWT_KEY = 'test';

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

global.signIn = () => {
  const payload = {
    id: new Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const sessionBase64 = Buffer.from(sessionJSON).toString('base64');
  return [`express:sess=${sessionBase64}`];
};
