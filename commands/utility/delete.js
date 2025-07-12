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
    if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
      return interaction.reply("You don't have this permission!");

    const deleteCount = Number(value);
    if (
      !deleteCount ||
      deleteCount < 1 ||
      deleteCount > 100
    )
      return;
    await interaction.deferReply();
    
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



