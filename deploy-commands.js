require("dotenv").config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const { CLIENT_ID, TOKEN } = process.env;

const commands = [];


const folders = fs.readdirSync('./src/commands');

for (const folder of folders) {
    const files = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of files) {
        const command = require(`./src/commands/${folder}/${file}`);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
           console.warn(`[WARNING]: ${command} don't have "data" or "execute"!`);
        }
    }
}
const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
    }
})();