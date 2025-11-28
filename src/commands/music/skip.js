const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips current song'),
    category: 'music',
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: `There is no music currently playing!`, ephemeral: true })
        }

        const success = queue.node.skip();

        return interaction.reply({
            content: success ? `** ${queue.currentTrack.title} **, Skipped song ✅` : `${interaction.author}, Something went wrong ❌`,
            ephemeral: true
        })
    }
}