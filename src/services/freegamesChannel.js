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

module.exports = { FreegamesChannel };