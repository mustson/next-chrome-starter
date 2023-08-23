import { MongoClient } from "mongodb";

let client;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });
    await client.connect();
  }

  return client.db(process.env.DATABASE_NAME);
}
