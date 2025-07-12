const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(`Shows mentioned user's avatar.`)
        .addUserOption(option =>
            option.setName('user')
                .setDescription("Mention the user.")
                .setRequired(true)),
    category: 'utility',
    async execute(interaction) {
        let user = interaction.options.getUser('user')
        if (!user) {
            return interaction.reply({ content: `Please metion a user!`, ephemeral: true });
        }
        const avatarEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Avatar Link')
            .setURL(`${user.displayAvatarURL()}?size=1024`)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setImage(`${user.displayAvatarURL()}?size=256`)
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
        await interaction.reply({ embeds: [avatarEmbed] });
    }
}