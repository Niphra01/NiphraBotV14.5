const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (interaction.isButton()) {
                return interaction.deferUpdate().catch(() => { });
            }

            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;

                await command.execute(interaction);
            }
        }catch (error) {
            console.error(`[INTERACTION ERROR] ${interaction.commandName}`, error);
            if (!interaction.deferred && !interaction.replied) {
                return interaction.reply({ content: "There was an error when running a command.", ephemeral: true });
            }
        }
    },
};