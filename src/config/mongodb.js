import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment.js'

const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

let trelloDbInstance = null;

const connectDb = async () => {
  try {
    await client.connect();
    trelloDbInstance = client.db(env.DATABASE_NAME);
    // eslint-disable-next-line no-console
    console.log('⚡️[MongoDB]: Connected successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌[MongoDB]: Connection failed', error);
    process.exit(1);
  }
};

const getDb = () => {
  if (!trelloDbInstance) {
    throw new Error('Database not connected');
  }

  return trelloDbInstance;
}

const closeDb = async () => {
  if (trelloDbInstance) {
    await trelloDbInstance.close();
  }
}

export { connectDb, getDb, closeDb };