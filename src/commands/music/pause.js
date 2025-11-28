const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the playing song'),
    category: 'music',
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: `There is no music currently playing!`, ephemeral: true })
        }

        const success = queue.node.pause();

        return interaction.reply({
            content: success ? `** ${queue.currentTrack.title} ** has paused ✅` : `${interaction.author}, Something went wrong ❌`,
            ephemeral: true
        })
    }
}