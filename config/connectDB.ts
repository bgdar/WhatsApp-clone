import { MongoClient, ServerApiVersion } from "mongodb";
const uri =
  "mongodb+srv://bgdar:Z_34Uxbz.ht6ZB9@chat-bun.g5a4y.mongodb.net/?retryWrites=true&w=majority&appName=Chat-bun";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getdatabase() {
  try {
    await client.connect();
    const database = await client.db("websocket");
    database.renameCollection("chat", "user");
    console.log("Koleksi chat berhasil dirednama menjadi user!");
  } catch (err) {
    console.error("terdapat error", err);
  }
}

const database = client.db("websocket");

export const createColllections = async (nameCollection: string) => {
  try {
    await database.createCollection(nameCollection);
    console.log("Koleksi berhasil dibuat!");
  } catch (err) {
    console.error("Gagal membuat koleksi:", err);
  }
};

export async function writeData(
  username: string,
  password: string,
  number: string
) {
  console.log("data destructuring :", username, password, number);
  const collection = database.collection("user");
  try {
    const result = await collection.insertOne({
      username: username,
      password: password,
      number: number,
    });
    console.log("Data berhasil ditulis dengan ID:", result.insertedId);
  } catch (err) {
    console.error("terdapat error", err);
  } finally {
    await client.close();
  }
}
