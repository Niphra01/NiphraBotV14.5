const { SlashCommandBuilder } = require('discord.js');
<<<<<<< HEAD
const { useMainPlayer, QueryType } = require('discord-player')
=======
const { useMainPlayer,QueryType } = require('discord-player')
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
const { playerOptions } = require('../../src/configs/playerConfigs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('plays music')
        .addStringOption(option =>
            option.setName('query')
                .setDescription("Type a query/url")
                .setRequired(true)),

    category: 'music',
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply({ content: 'You are not connected to a voice channel!', ephemeral: true })
        const query = interaction.options.getString("query", true)

        await interaction.deferReply();

<<<<<<< HEAD
        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })
=======
        const searchResult = await player.search(query, { requestedBy: interaction.user , searchEngine: QueryType.AUTO});
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
        if (!searchResult.hasTracks()) {
            await interaction.editReply({ content: `We found no tracks for ${query}`, ephemeral: true });
            return;
        }

        const queue = await player.nodes.create(interaction.guild, {
            selfDeaf: playerOptions.selfDeaf ?? true,
            volume: playerOptions.volume ?? 65,
            leaveOnEmpty: playerOptions.leaveOnEmpty ?? true,
            leaveOnEmptyCooldown: playerOptions.leaveOnEmptyCooldown ?? 60000,
            leaveOnEnd: playerOptions.leaveOnEnd ?? true,
            leaveOnEndCooldown: playerOptions.leaveOnEmptyCooldown ?? 60000,
            maxHistorySize: playerOptions.maxHistorySize ?? 100,
            maxSize: playerOptions.maxQueueSize ?? 1000

        })
<<<<<<< HEAD

        try {
            if (!queue.connection) await queue.connect(channel);
            if (searchResult.playlist) {
                await interaction.followUp({ content: `**${searchResult.tracks[0].title} - ${searchResult.tracks.length - 1} more ** added to queue.`, ephemeral: true })
                queue.addTrack(searchResult.tracks)
            }
            else {
                await interaction.followUp({ content: `**${searchResult.tracks[0].title}** added to queue.`, ephemeral: true })
                queue.addTrack(searchResult.tracks[0])
            }
            
        }
        catch (error) {
            //console.log('Playback Error:', error);
            await player.destroy(interaction.guild.id); // Use nodes.destroy instead of player.destroy
            return interaction.followUp({
                content: `Failed to play "${query}". Try a different source (e.g., Spotify) or check the query. Error: ${error.message}`,
                ephemeral: true
            });
        }
        if (!queue.isPlaying()) await queue.node.play();
        
=======
        
        try {
            if (!queue.connection) await queue.connect(channel);
            if(searchResult.playlist){
                await interaction.followUp({ content: `**${searchResult.tracks[0].title} - ${searchResult.tracks.length-1} more ** added to queue.`, ephemeral: true }) 
                queue.addTrack(searchResult.tracks)
            }
            else{
                await interaction.followUp({ content: `**${searchResult.tracks[0].title}** added to queue.`, ephemeral: true })
                queue.addTrack(searchResult.tracks[0]) 
            }
        } 
        catch (error) {
            await player.destroy(interaction.guild.id)
            return interaction.followUp({ content: `Something went wrong: ${error}`, ephemeral: true })
        }

        if (!queue.isPlaying()) await queue.node.play();
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
    }
}