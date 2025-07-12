const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player')
const { playerOptions } = require('../../src/configs/playerConfigs')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('np')
        .setDescription('Shows currently playing song'),
    category: 'music',
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);
        if (!queue || !queue.node.isPlaying) {
            return interaction.reply({ content: `There is no music currently playing!`, ephemeral: true })
        }

        const track = queue.currentTrack;
        const timeStamp = queue.node.getTimestamp();
        const bar = `**\`${timeStamp.current.label}\`** ${queue.node.createProgressBar({
            queue: false,
            length: playerOptions.progressBar.length ?? 12,
            timecodes: playerOptions.progressBar.timecodes ?? false,
            indicator: playerOptions.progressBar.indicator ?? '🔘',
            leftChar: playerOptions.progressBar.leftChar ?? '▬',
            rightChar: playerOptions.progressBar.rightChar ?? '▬'
        })} **\`${timeStamp.total.label}\`**`;

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setThumbnail(track.thumbnail)
            .setTitle(track.title)
            .setDescription(`Duration ${bar}\nURL:${track.url}\n${track.requestedBy}`)
            .setTimestamp()

        return interaction.reply({
            embeds: [embed]
        })
    }
}