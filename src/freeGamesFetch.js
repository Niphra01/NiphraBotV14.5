require("dotenv").config();
const { EmbedBuilder, time } = require("discord.js");
const Mongo = require("./configs/DbConfig");
const fetch = require("node-fetch");
const date = new Date();

async function GetGames(client) {
    try {
        const gamesColl = await Mongo.getGamesCollection();
        const channelColl = await Mongo.getChannelCollection();
        
        const fGamesResult = await callGames(gamesColl);
        const channelResult = await channelColl.find({}).toArray();
        //deleting a document if document has been in db more than 29 days
        await Promise.all(
            fGamesResult.map(async (item) => {
                const dt = new Date(item.dataDate);
                if (Math.floor(Math.abs(date - dt) / (1000 * 60 * 60 * 24)) >= 30) {
                    await gamesColl.deleteOne({ dataId: item.dataId });
                }
            })
        );
        await EpicGames(client, channelResult,gamesColl);
        //await RedditFetch(client, channelResult,gamesColl);
    } catch (error) {
        console.error("Error in GetGames:", error);
        throw error;
    }
}
async function callGames(gamesColl) {
    try {
        const result = await gamesColl.find({}).toArray();
        return result || [];
    } catch (error) {
        console.error("Error in callGames:", error);
        throw error;
    }
}

const EpicGames = async (client, channelResult, gamesColl) => {
    const url =
        "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US,CN";
    const options = {
        method: "GET",
        headers: { "user-agent": process.env.USERAGENT },
    };
    try {
        const res = await fetch(url, options);
        const data = await res.json();
        await Promise.all(
            data.data.Catalog.searchStore.elements.map(async (el) => {
                const gResult = await callGames(gamesColl);
                if (!gResult.some((item) => item.dataId === el.id)) {
                    console.log(`Processing game: ${el.title}`);
                    if (
                        el.promotions &&
                        el.promotions.promotionalOffers.length !== 0 &&
                        el.promotions.promotionalOffers[0].promotionalOffers[0].startDate < Date.now() !== 0 &&
                        el.price.totalPrice.discountPrice === 0
                    ) {
                        console.log(`Found free game: ${el.title}`);
                        const gameImage = el.keyImages.find((item) =>
                            item.type === "Thumbnail" ||
                            item.type === "DieselStoreFrontWide"
                        )?.url;
                        const gameURL = el.productSlug != null ? `https://store.epicgames.com/en-US/p/${el.productSlug}` : `https://store.epicgames.com/en-US/p/${el.catalogNs.mappings[0].pageSlug}`;

                        const epicEmbed = new EmbedBuilder()
                            .setTitle(el.title.toString())
                            .setDescription(el.description.toString())
                            .setImage(gameImage)
                            .setURL(gameURL)
                            .addFields([
                                { name: "Price", value: `Free` },
                                {
                                    name: "Free Until",
                                    value: `${time(new Date(el.promotions.promotionalOffers[0].promotionalOffers[0].endDate), "f")}`,
                                },
                            ]);
                        await DatabaseAdd(el.id, el.title, gameURL, gamesColl);
                        await FreegamesChannel(epicEmbed, client, channelResult);
                    }
                }
            })
        );
    } catch (error) {
        console.error("Error in EpicGames:", error);
    }
};

const RedditFetch = async (client, channelResult, gamesColl) => {
    const conditions = [
        "gog.com",
        "store.ubi",
        "origin.com",
        "ea.com",
        "xbox.com",
    ];
    const dataFlair = ["Commercial Game"];
    //Getting posts from the freegames subreddits
    const targetURL = "https://reddit.com/r/freegames/new/.json?limit=25";
    try {
        await 2000
        const resp = await fetch(targetURL, {
            headers: { "user-agent": process.env.USERAGENT },
        });
        const res = await resp.json();
        const posts = res.data.children;

        await Promise.all(
            posts.map(async (post) => {
                if (
                    dataFlair.some((el) => post.data.link_flair_text?.includes(el) || true) &&
                    conditions.some((c) => post.data.url.includes(c))
                ) {
                    const gResult = await callGames(gamesColl);
                    if (!gResult.some((item) => item.dataURL === post.data.url)) {
                        const gameEmbed = new EmbedBuilder()
                            .setTitle(post.data.title)
                            .setImage(post.data.thumbnail)
                            .setURL(post.data.url)
                            .addFields([{ name: "Price", value: "Free" }]);

                        await DatabaseAdd(post.data.id, post.data.title, post.data.url, gamesColl);
                        await FreegamesChannel(gameEmbed, client, channelResult);
                    }
                }
            })
        );
    } catch (error) {
        console.error("Error in RedditFetch:", error);
    }
};

const DatabaseAdd = async (itemId, itemTitle, itemURL, gamesColl) => {
    try {
        await gamesColl.insertMany([
            {
                dataId: itemId,
                dataName: itemTitle,
                dataDate: date,
                dataURL: itemURL,
            },
        ]);
    } catch (err) {
        console.error("Error in DatabaseAdd:", error);
    }
};

const FreegamesChannel = async (embed, client, channelResult) => {
    try {
        await Promise.all(
            channelResult.map(async (fGuild) => {
                const freeGamesGuild = client.guilds.cache.get(fGuild.mGuildId);
                const freeGamesChannel = freeGamesGuild?.channels.cache.get(fGuild.mChannelId);
                if (freeGamesChannel) {
                    await freeGamesChannel.send({ embeds: [embed] });
                } else {
                    console.warn(
                        `Channel ${fGuild.mChannelId} not found in guild ${fGuild.mGuildId}`
                    );
                }
            })
        );
    } catch (error) {
        console.error("Error in FreegamesChannel:", error);
    }
};
module.exports = { GetGames };
