const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the queue'),
    category: 'music',
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: `There is no music currently playing!`, ephemeral: true })
        }

        if (!queue.tracks[0]) {
            return interaction.reply({ content: `There is no more music in queue after current!`, ephemeral: true })
        }
        await queue.tracks.clear();

        return interaction.reply({ content: `The queue has just been cleared. 🗑️` });
    }
}