const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the queue'),
    category: 'music',
    async execute(interaction) {

        const queue = useQueue(interaction.guild.id)

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: `There is no music currently playing!`, ephemeral: true })
        }
        if (queue.tracks.size < 1) {
            return interaction.reply({ content: `There is no more music in queue after current!`, ephemeral: true })
        }
        const methods = ["🔁", "🔂"];
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
            .setTitle(`Server Music List - ${interaction.guild.name} ${methods[queue.repeatMode]}`)

        const tracks = queue.tracks.data.map((track, i) => 
             `**${i + 1}** - ${track.title} | (<@${track.requestedBy.id}>)`
         )


        const songs = queue.tracks.size;
        const nextSongs = songs > 5
            ? `And **${songs - 5}** Other Song...`
            : `There are **${songs}** Songs in the List.`;

        embed.setDescription(
            `Currently Playing: \`${queue.currentTrack.title}\`\n\n 
                ${tracks.slice(0, 5).join('\n')}\n\n ${nextSongs}`
        )
        embed.setTimestamp();

        return interaction.reply({ embeds: [embed] })
    }
}