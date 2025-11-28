require("dotenv").config();
const date = new Date();
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@cluster0.hl4zr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 50000, // 30 saniye
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000
});
let dbo;

const connect = async () => {
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
const getGamesCollection = async () => {
  return (await connect()).collection('FetchedGames')
}
const getChannelCollection = async () => {
  return (await connect()).collection('FreegamesChannel')
}

const DatabaseAdd = async (itemId, itemTitle, itemURL) => {
  try {
    const gamesColl = await getGamesCollection();
    await gamesColl.insertMany([
      {
        dataId: itemId,
        dataName: itemTitle,
        dataDate: date,
        dataURL: itemURL,
      },
    ]);
    console.log(`Database: Added ${itemTitle}`);
  } catch (err) {
    console.error("Error in DatabaseAdd:", error);
  }
};

module.exports = {
  connect,
  DatabaseAdd,
  getGamesCollection,
  getChannelCollection
};