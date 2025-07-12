const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop music entirely'),
    category: 'music',
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.node.isPlaying) {
            return interaction.reply({ content: `There is no music currently playing!`, ephemeral: true })
        }

        queue.delete();
        return interaction.reply({ content: `Music stopped`, ephemeral: true })
    }
}