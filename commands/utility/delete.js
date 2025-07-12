const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete messages')
    .addIntegerOption(option =>
      option.setName('value')
        .setDescription('Input number for how many messages you want to be Delete')
        .setRequired(true)
    ),
  category: 'utility',
  async execute(interaction) {
    const value = interaction.options.getInteger('value', true)
<<<<<<< HEAD
    if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
      return interaction.reply("You don't have this permission!");

=======
    if (interaction.member.user.id !== "201652761031475200") {
      if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
        return interaction.reply("You don't have this permission!");
    }
>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
    const deleteCount = Number(value);
    if (
      !deleteCount ||
      deleteCount < 1 ||
      deleteCount > 100
    )
      return;
    await interaction.deferReply();
<<<<<<< HEAD
    
=======

>>>>>>> dbda6315992df51f260d29732a6e6b3fe89301ca
    await interaction.channel
      .bulkDelete(deleteCount + 1)
      .then(async () => {
        await interaction.channel.send({ content: `**${value}** message deleted by => ${interaction.user}` });
      })
      .catch(async (error) => {
        await interaction.channel.send({ content: `Couldn't delete messages because of: **${error}**` });
      });
  },
};



