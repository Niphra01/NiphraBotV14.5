const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { FreegamesChannel } = require("../services/freegamesChannel");
const { DatabaseAdd } = require("../services/gameDatabaseService");

const RedditScraper = async (client, channelResult, existingGames) => {
    const conditions = [
        "gog.com",
        "store.ubi",
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


        for (const post of posts) {
            if (
                dataFlair.some(el => post.data.link_flair_text?.includes(el)) &&
                conditions.some((c) => post.data.url.includes(c))
            ) {
                fetchURL = post.data.url;
                if (fetchURL.includes("gog.com")) {
                    fetchURL = fetchURL.replace(/\/\w{2}/, "/en");
                } else {
                    fetchURL = fetchURL.replace(/\/[a-z]{2}\//, "/en-us/");
                }

                if (!existingGames.has(fetchURL)) {
                    console.log("Reddit: ", post.data.title);

                    const res = await fetch(fetchURL, { headers: { "User-Agent": process.env.USERAGENT, "Accept-Language": "en-US,en;q=0.9" } });
                    const html = await res.text();
                    const $ = cheerio.load(html);


                    const title = $("meta[property='og:title']").attr("content") || post.data.title;
                    const desc = $("meta[property='og:description']").attr("content") || "No description available.";
                    const img = $("meta[property='og:image']").attr("content") || null;
                    const platform = $("meta[property='og:site_name']").attr("content") || "Various";
                    let endTime;
                    if (fetchURL.includes("store.ubi")) {
                        endTime = $$(".promotion-end-date-content ").text().trim();
                    }
                    else if (fetchURL.includes("gog.com")) {
                        endTime = $$(".product-actions__time ").text().trim();
                    }
                    const match = endTime.match(/(\d{1,2}\s+\w{3})\s*@\s*(\d{1,2}:\d{2}\s*(am|pm))/i);
                    let freeUntil;
                    if (match) {
                        const datePart = match[1];
                        const timePart = match[2];
                        const year = new Date().getFullYear();

                        freeUntil = `${datePart} ${year} ${timePart}`;
                    }
                    const embed = new EmbedBuilder()
                        .setTitle(title)
                        .setDescription(desc)
                        .setImage(img || null)
                        .setURL(fetchURL)
                        .addFields([
                            { name: "Price", value: "Free" },
                            {
                                name: "Free Until",
                                value: `${freeUntil}` || "Unknown",
                            },
                            { name: "Platform", value: platform }
                        ]);

                    await DatabaseAdd(post.data.id, title, fetchURL);
                    await FreegamesChannel(embed, client, channelResult);

                    existingGames.add(post.data.id);
                    existingGames.add(fetchURL);
                }
            }
        }
    } catch (error) {
        console.error("Error in RedditFetch:", error);
    }
};
module.exports = { RedditScraper };