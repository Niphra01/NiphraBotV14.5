require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { TOKEN } = process.env;
const fs = require("node:fs");
const path = require("node:path");
const { Player } = require('discord-player')
const { SpotifyExtractor } = require('@discord-player/extractor');
const { YoutubeiExtractor } = require("discord-player-youtubei")
<<<<<<< HEAD

=======
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
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

<<<<<<< HEAD
player.extractors.register(YoutubeiExtractor, {
    overrideBridgeMode: "ytmusic",
})
=======
player.extractors.register(YoutubeiExtractor, {})
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
player.extractors.register(SpotifyExtractor, {});


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
        }
    }
}

const eventsFolderPath = path.join(__dirname, 'events');
const eventFolders = fs.readdirSync(eventsFolderPath)

for (const folder of eventFolders) {
    const eventsPath = path.join(eventsFolderPath, folder);
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file)
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => { event.execute(...args) })
        } else {
            client.on(event.name, (...args) => { event.execute(...args) })
        }
    }

}

client.login(TOKEN);

