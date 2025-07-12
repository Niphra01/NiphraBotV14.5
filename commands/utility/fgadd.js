const { SlashCommandBuilder } = require('discord.js');
const Mongo = require("../../src/configs/DbConfig");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgadd')
        .setDescription('Adding your channel to Database for free games!'),
    category: 'utility',
    async execute(interaction) {
        console.log(interaction)
        try {
            const channelColl = await Mongo.getChannelCollection();
            await channelColl.insertOne([
                {
                    mGuildId: interaction.guildId,
                    mChannelId: interaction.channelId,
                }
            ])
            interaction.reply({content:'Channel added to database.',ephemeral:true})
        } catch (err) { 
            interaction.reply({content:'Channel is already in database.',ephemeral:true})
        }
    },
};
