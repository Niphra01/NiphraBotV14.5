const Mongo = require("./gameDatabaseService");
const date = new Date();
const { SteamScraper } = require("../scrapers/steamScraper");
const { EpicScraper } = require("../scrapers/epicScraper");
const { RedditScraper } = require("../scrapers/redditScraper");


const runAllScrapers = async (client) => {
    try {
        const gamesColl = await Mongo.getGamesCollection();
        const channelColl = await Mongo.getChannelCollection();

        const games = await gamesColl.find(
            { dataId: { $exists: true }, dataURL: { $exists: true } },
            { projection: { dataId: 1, dataURL: 1 } }
        ).toArray();

        const existingGames = new Set();
        for (const game of games) {
            if (game.dataId) existingGames.add(String(game.dataId));
            if (game.dataURL) existingGames.add(game.dataURL);
        }

        const channelResult = await channelColl.find({}).toArray();
        for (const game of existingGames) {
            const dt = new Date(game.dataDate);
            if (Math.floor(Math.abs(date - dt) / (1000 * 60 * 60 * 24)) >= 30) {
                await gamesColl.deleteOne({ dataId: game.dataId });
            }
        };

        await SteamScraper(client, channelResult, existingGames);
        await EpicScraper(client, channelResult, existingGames);
        await RedditScraper(client, channelResult, existingGames);
    } catch (error) {
        console.error("Error in runAllScrapers:", error);
    }
}
module.exports = { runAllScrapers };
