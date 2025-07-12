const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('move music')
        .addStringOption(option1 =>
            option1.setName('where')
                .setDescription("Type the number the song you to move.")
                .setRequired(true))
        .addStringOption(option2=> 
            option2.setName('to')
            .setDescription('Type the number where you want to move')
            .setRequired(true)
        ),
    category: 'music',
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply({ content: 'You are not connected to a voice channel!', ephemeral: true })
        const query1 = interaction.options.getString("where", true)
        const query2 = interaction.options.getString("to", true)

        const queue = useQueue(interaction.guild.id);

        
        const selectedSong = queue.tracks.data[query1-1];
        await queue.moveTrack(selectedSong,query2-1);



        return interaction.reply({ content: `${selectedSong.title} has moved. ` });

    }
}