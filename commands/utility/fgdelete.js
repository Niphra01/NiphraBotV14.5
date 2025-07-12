const { SlashCommandBuilder } = require('discord.js');
const Mongo = require("../../src/configs/DbConfig");
<<<<<<< HEAD
=======
const channelColl = Mongo.dbo.collection("FreegamesChannel");
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgdelete')
        .setDescription('Adding your channel to Database for free games!'),
    category: 'utility',
    async execute(interaction) {
        try {
<<<<<<< HEAD
            const channelColl = await Mongo.getChannelCollection();
            await channelColl.deleteMany( {mGuildId:`${interaction.guildId}`,mChannelId:`${interaction.channelId}`} );
            await interaction.reply({content:`Channel is deleted from Database. You'll not get Free Game post anymore on this channel.`,ephemeral:true})
=======
            await Mongo.mongoClient.connect();
            await channelColl.deleteMany( {mGuildId:`${interaction.guildId}`,mChannelId:`${interaction.channelId}`} );
            await interaction.reply({content:`Channel is deleted from Database. You'll not get Free Game post anymore on this channel.`,ephemeral:true})
            await Mongo.mongoClient.close();
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
        } catch (err) { 
        }
    },
};
