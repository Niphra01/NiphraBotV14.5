const fs = require('fs');
const path = require('path');
module.exports = (client) => {
    try {
        const eventPath = path.join(__dirname,'../events');
        const folders = fs.readdirSync(eventPath);

        for (const folder of folders) {
            const folderPath = path.join(eventPath, folder);
            const events = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of events) {
                const filePath = path.join(folderPath, file);
                const event = require(filePath);
                if (event.once) {
                    client.once(event.name, (...args) => { event.execute(...args) })
                } else {
                    client.on(event.name, (...args) => { event.execute(...args) })
                }
            }
        }
    } catch (err) {
        console.error("Error loading events:", err);
    }
}