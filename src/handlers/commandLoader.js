const fs = require('fs');
const path = require('path');
module.exports = (client) => {

    try {
        const commandsPath = path.join(__dirname,'../commands');
        const folders = fs.readdirSync(commandsPath);
        for (const folder of folders) {
            const folderPath = path.join(commandsPath, folder);
            const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of files) {
                const filePath = path.join(folderPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.warn(`[WARNING]: ${command} don't have "data" or "execute"!`);
                }
            }
        }
    } catch (err) {
        console.error("Error loading commands:", err);
    }
}
