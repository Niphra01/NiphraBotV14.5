const { EmbedBuilder, time} = require("discord.js");
const fetch = require("node-fetch");
const { FreegamesChannel } = require("../services/freegamesChannel");
const { DatabaseAdd } = require("../services/gameDatabaseService");
const EpicScraper = async (client, channelResult, existingGames) => {
    const url =
        "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US#";
    const options = {
        method: "GET",
        headers: { "user-agent": process.env.USERAGENT },
    };
    try {
        const res = await fetch(url, options);
        const data = await res.json();
        const elements = data.data.Catalog.searchStore.elements;
        const freeGames = elements.filter((el) => {
            if (!el.promotions || !el.promotions.promotionalOffers.length) return false;

            const isFree = el.price?.totalPrice?.discountPrice === 0;
            const start = new Date(el.promotions.promotionalOffers[0].promotionalOffers[0].startDate);
            const end = new Date(el.promotions.promotionalOffers[0].promotionalOffers[0].endDate);
            const now = new Date();
            return now >= start && now <= end && isFree;
        });

        for (const el of freeGames) {
            if (!existingGames.has(el.id)) {
                console.log(`Epic Games: ${el.title}`);
                const gameImage = el.keyImages.find((item) =>
                    item.type === "Thumbnail" ||
                    item.type === "DieselStoreFrontWide"
                )?.url;
                const gameURL = el.productSlug != null ? `https://store.epicgames.com/en-US/p/${el.productSlug}` : `https://store.epicgames.com/en-US/p/${el.catalogNs.mappings[0].pageSlug}`;

                const embed = new EmbedBuilder()
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
                await FreegamesChannel(embed, client, channelResult);
                await DatabaseAdd(el.id, el.title, gameURL);

                existingGames.add(el.id);
                existingGames.add(gameURL);
            }
        }
    }
    catch (error) {
        console.error("Error in EpicGames:", error);
    }
};

module.exports = { EpicScraper };