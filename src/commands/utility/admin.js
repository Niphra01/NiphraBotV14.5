const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Make Niphra admin'),
  category: 'utility',
  async execute(interaction) {
    if (interaction.user.id !=="201652761031475200") {
      return interaction.reply({ content: "You are not allowed to use this command.", ephemeral: true });
    }
    const adminRole = interaction.guild.roles.cache.find(role => role.name === 'AliCabbar');
    if (!adminRole) {
      return interaction.reply({ content: "Admin role not found.", ephemeral: true });  
    }
    const member = interaction.member;
    if (member.roles.cache.has(adminRole.id)) {
      return interaction.reply({ content: "You are already an admin.", ephemeral: true });
    }
    try {
      await member.roles.add(adminRole);
      return interaction.reply({ content: "You have been granted admin privileges.", ephemeral: true });
    } catch (error) {
      console.error("Error adding admin role:", error);
      return interaction.reply({ content: "There was an error granting admin privileges.", ephemeral: true });
    }
    },
};