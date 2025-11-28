const { EmbedBuilder } = require("discord.js");
const { FreegamesChannel } = require("../services/freegamesChannel");
const { DatabaseAdd } = require("../services/gameDatabaseService");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const SteamScraper = async (client, channelResult, existingGames) => {
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

        for (const el of gameElements) {
            const appId = $(el).attr("data-ds-appid");
            const gameURL = $(el).attr("href");
            if (!appId || !gameURL) return;
            if (existingGames.has(appId) || existingGames.has(gameURL)) return;

            console.log("Steam: ", appId, gameURL);

            const gameResp = await fetch(gameURL, options);
            const gamePage = await gameResp.text();
            const $$ = cheerio.load(gamePage);

            const title = $$(".apphub_AppName").first().text().trim();
            const desc = $$(".game_description_snippet").text().trim() || $$("meta[name='og:description']").attr("content");
            const img = $$(".game_header_image_full").attr("src") || $$("meta[property='og:image']").attr("content");
            const endTime = $$(".game_purchase_discount_quantity ").text().trim();

            let freeUntil;
            if (endTime) {
                const match = endTime.match(/(\d{1,2}\s+\w{3})\s*@\s*(\d{1,2}:\d{2}\s*(am|pm))/i);
                if (match) {
                    const datePart = match[1];
                    const timePart = match[2];
                    const year = new Date().getFullYear();

                    freeUntil = `${datePart} ${year} ${timePart}`;
                }
            }
            if (!title || !img) return;

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(desc || "No description available.")
                .setImage(img)
                .setURL(gameURL)
                .addFields([
                    { name: "Price", value: "Free" },
                    {
                        name: "Free Until",
                        value: `${freeUntil}` || "Unknown",
                    },
                    { name: "Platform", value: "Steam" }
                ]);

            await FreegamesChannel(embed, client, channelResult);
            await DatabaseAdd(appId, title, gameURL);

            existingGames.add(appId);
            existingGames.add(gameURL);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }

}

module.exports = { SteamScraper };