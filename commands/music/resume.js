const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the stopped song'),
    category: 'music',
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id)
        if (!queue) {
            return interaction.reply({ content: `There is no music currently playing!`, ephemeral: true })
        }
        if (!queue.node.isPaused()) {
            return interaction.reply({ content: `Music still playing!`, ephemeral: true })
        }

        const success = queue.node.resume();

        return interaction.reply({
            content: success ? `** ${queue.currentTrack.title} ** now resuming ✅` : `${interaction.user}, Something went wrong ❌`,
            ephemeral: true
        })
    }
}