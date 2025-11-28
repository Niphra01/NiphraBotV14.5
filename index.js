require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const { Player } = require('discord-player')
const { SpotifyExtractor } = require('@discord-player/extractor');
const { YoutubeiExtractor } = require("discord-player-youtubei")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
});

const player = new Player(client)

player.extractors.register(YoutubeiExtractor, {
    overrideBridgeMode: "ytmusic",
})
player.extractors.register(SpotifyExtractor, {});
client.player = player

client.commands = new Collection();


require('./src/handlers/commandLoader')(client);
require('./src/handlers/eventLoader')(client);


client.login(process.env.TOKEN);

