const { SlashCommandBuilder } = require('discord.js');
const Mongo = require("../../src/configs/DbConfig");
<<<<<<< HEAD
=======
const channelColl = Mongo.dbo.collection("FreegamesChannel");
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgadd')
        .setDescription('Adding your channel to Database for free games!'),
    category: 'utility',
    async execute(interaction) {
        console.log(interaction)
        try {
<<<<<<< HEAD
            const channelColl = await Mongo.getChannelCollection();
            await channelColl.insertOne([
=======
            await  Mongo.mongoClient.connect();
            await channelColl.insertMany([
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
                {
                    mGuildId: interaction.guildId,
                    mChannelId: interaction.channelId,
                }
            ])
            interaction.reply({content:'Channel added to database.',ephemeral:true})
<<<<<<< HEAD
=======
            await  Mongo.mongoClient.close();
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
        } catch (err) { 
            interaction.reply({content:'Channel is already in database.',ephemeral:true})
        }
    },
};
