require("dotenv").config();

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@cluster0.hl4zr.mongodb.net/?retryWrites=true&w=majority`;
<<<<<<< HEAD
// const uri = `mongodb+srv://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@cluster0.hl4zr.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsInsecure=true`;

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 50000, // 30 saniye
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000
});
let dbo;

async function connect() {
  if (dbo) return dbo; // Reuse existing connection
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    dbo = client.db('BotDB'); 
    return dbo;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

module.exports = { 
    connect,
    getGamesCollection: async () => (await connect()).collection('FetchedGames'),
    getChannelCollection: async () => (await connect()).collection('FreegamesChannel'),
};
=======

const mongoClient = new MongoClient(uri);
const dbo = mongoClient.db("BotDB");

module.exports = { dbo, mongoClient };
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
