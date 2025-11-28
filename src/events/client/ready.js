const { Events, ActivityType } = require('discord.js');
const { runAllScrapers } = require('../../services/scraperScheduler');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user.setActivity('Git - Gud', { type: ActivityType.Competing })
        console.log(`Ready! Logged in as ${client.user.tag}`)
	await runAllScrapers(client);
        setInterval(async function () {
            await runAllScrapers(client);
        }, 1000 * 60 * 60)
    },
};