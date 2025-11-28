const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Shows the bot info'),
    category: 'utility',
    async execute(interaction) {
        let client = interaction.client;

        let botIcon = client.user.displayAvatarURL();
        const botEmbed = new EmbedBuilder()
            .setColor("0ED4DA")
            .setThumbnail(botIcon)
            .setTitle(`${client.user.username}`)
            .addFields([
                {
                    name: "Developer",
                    value: userMention("201652761031475200")
                },
                { name: "Created at", value: client.user.createdAt.toLocaleString() },
                { name: "Servers", value: client.guilds.cache.size.toString() },
            ]);
        return interaction.reply({ embeds: [botEmbed] });
    }
}