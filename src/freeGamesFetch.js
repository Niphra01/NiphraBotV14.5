require("dotenv").config();
const { EmbedBuilder, time } = require("discord.js");
const Mongo = require("./configs/DbConfig");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
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
        await SteamGames(client, channelResult, gamesColl);
        await EpicGames(client, channelResult, gamesColl);
        await RedditFetch(client, channelResult, gamesColl);
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
const SteamGames = async (client, channelResult, gamesColl) => {
    const url = "https://store.steampowered.com/search/results/?query=&start=0&count=50&maxprice=free&supportedlang=english,turkish&specials=1&hidef2p=1&ndl=1&cc=us";
    const options = {
        method: "GET",
        headers: {
            "User-Agent": process.env.USERAGENT,
            "Cookie": "birthtime=0; lastagecheckage=1-1-1980;",
        },
    }
    try {
        const res = await fetch(url, options);
        const html = await res.text();
        const $ = cheerio.load(html);
        const gameElements = $("a.search_result_row");

        if (!gameElements.length) {
            console.error("Steam: No games found!");
            return;
        }

        await Promise.all(
            gameElements.map(async (i, el) => {
                const appId = $(el).attr("data-ds-appid");
                if (!appId) return;

                const gResult = await callGames(gamesColl);
                if (gResult.some((item) => item.dataId === appId)) return;

                const gameURL = $(el).attr("href");

                console.log("Processing game:", appId, gameURL);

                const gameResp = await fetch(gameURL, options);
                const gamePage = await gameResp.text();
                const $$ = cheerio.load(gamePage);

                const title = $$(".apphub_AppName").first().text().trim();
                const desc = $$(".game_description_snippet").text().trim();
                const img = $$(".game_header_image_full").attr("src");
                const endTime = $$(".game_purchase_discount_quantity ").text().trim();
                const match = endTime.match(/(\d{1,2}\s+\w{3})\s*@\s*(\d{1,2}:\d{2}\s*(am|pm))/i);
                let finalDate;
                if (match) {
                    const datePart = match[1];
                    const timePart = match[2];
                    const year = new Date().getFullYear();

                    finalDate = `${datePart} ${year} ${timePart}`;
                }

                if (!title || !desc || !img) return;

                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(desc)
                    .setImage(img)
                    .setURL(gameURL)
                    .addFields([
                        { name: "Price", value: "Free" },
                        {
                            name: "Free Until",
                            value: `${finalDate}` || "Unknown",
                        },
                        { name: "Platform", value: "Steam" }
                    ]);

                try {
                    await FreegamesChannel(embed, client, channelResult);
                    await DatabaseAdd(appId, title, gameURL, gamesColl);
                } catch (err) {
                    console.error("Error in FreegamesChannel:", err);
                }
            }).get()
        );
    } catch (error) {
        console.error("Fetch error:", error);
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
                                {
                                      name: "Platform", value: "Epic Games" 
                                }
                            ]);
                        try {
                            await FreegamesChannel(epicEmbed, client, channelResult);
                            await DatabaseAdd(el.id, el.title, gameURL, gamesColl);
                        }
                        catch (err) { console.error("Error in sending FreegamesChannel:", err); }
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
    const targetURL = `https://reddit.com/r/freegames/search.json?q=flair:"Commercial Game"&restrict_sr=1&sort=new&limit=10`;
    try {
        const resp = await fetch(targetURL, {
            headers: { "user-agent": process.env.USERAGENT },
        });
        const res = await resp.json();
        const posts = res.data.children;
        const gResult = await callGames(gamesColl);
        const urlSet = new Set(gResult.map(item => item.dataURL));

        for (const post of posts) {
            console.log("Checking Reddit post:", post.data.title);
            if (
                dataFlair.some(el => post.data.link_flair_text?.includes(el)) &&
                conditions.some((c) => post.data.url.includes(c))
            ) {
                //if (!urlSet.has(post.data.url)) {
                    fetchURL = post.data.url;

                    
                        
                     if (fetchURL.includes("gog.com")) {
                        fetchURL = fetchURL.replace(/\/\w{2}/, "/en");
                    }else{
                        fetchURL = fetchURL.replace(/\/[a-z]{2}\//, "/en-us/");
                    }

                    const res = await fetch(fetchURL, { headers: { "User-Agent": process.env.USERAGENT ,"Accept-Language": "en-US,en;q=0.9"} });
                    const finalUrl = res.url;
                    console.log(finalUrl)
                    const html = await res.text();
                    const $ = cheerio.load(html);


                    const title = $("meta[property='og:title']").attr("content") || post.data.title;
                    const desc = $("meta[property='og:description']").attr("content") || "No description available.";
                    const img = $("meta[property='og:image']").attr("content") || null;
                    const platform = $("meta[property='og:site_name']").attr("content") || "Various";
                    const gameEmbed = new EmbedBuilder()
                        .setTitle(title)
                        .setDescription(desc)
                        .setImage(img || null)
                        .setURL(fetchURL)
                        .addFields([
                            { name: "Price", value: "Free" },
                            { name: "Platform", value: platform }
                        ]);

                    await DatabaseAdd(post.data.id, post.data.title, post.data.url, gamesColl);
                    await FreegamesChannel(gameEmbed, client, channelResult);
                //}
            }
        }
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
