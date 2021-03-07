import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, Types } from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signIn(id?: string): string[];
    }
  }
}

jest.mock('../nats-wrapper');

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
  jest.clearAllMocks();
  const collections = await connection.db.collections();
  for (let collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  await mongo.stop();
  await connection.close();
});

global.signIn = (id?: string) => {
  const payload = {
    id: id || new Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const sessionBase64 = Buffer.from(sessionJSON).toString('base64');
  return [`express:sess=${sessionBase64}`];
};
