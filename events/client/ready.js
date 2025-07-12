const { Events, ActivityType } = require('discord.js');
const { GetGames } = require('../../src/freeGamesFetch');

module.exports = {
    name: Events.ClientReady,
    once: true,
<<<<<<< HEAD
    async execute(client) {
        client.user.setActivity('Git - Gud', { type: ActivityType.Competing })
        console.log(`Ready! Logged in as ${client.user.tag}`)
	await GetGames(client);
=======
    execute(client) {
        client.user.setActivity('Git - Gud', { type: ActivityType.Competing })
        console.log(`Ready! Logged in as ${client.user.tag}`)
	GetGames(client);
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
        setInterval(async function () {
            await GetGames(client);
        }, 1000 * 60 * 60)
    },
};