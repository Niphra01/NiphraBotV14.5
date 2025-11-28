const { SlashCommandBuilder } = require('discord.js');
const Mongo = require("../../services/gameDatabaseService");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgdelete')
        .setDescription('Adding your channel to Database for free games!'),
    category: 'utility',
    async execute(interaction) {
        try {
            const channelColl = await Mongo.getChannelCollection();
            await channelColl.deleteMany( {mGuildId:`${interaction.guildId}`,mChannelId:`${interaction.channelId}`} );
            await interaction.reply({content:`Channel is deleted from Database. You'll not get Free Game post anymore on this channel.`,ephemeral:true})
        } catch (err) { 
        }
    },
};
