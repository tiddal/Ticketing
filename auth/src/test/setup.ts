import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection } from 'mongoose';
import { app } from '../app';

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
