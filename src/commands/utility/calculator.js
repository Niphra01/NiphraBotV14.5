const math = require("math-expression-evaluator");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculator')
        .setDescription('Calculate formulas')
        .addStringOption(option =>
            option
                .setName('value')
                .setDescription('Need a value for calculation')
                .setRequired(true)),
    category: 'utility',
    async execute(interaction) {
        let value = interaction.options.getString('value', true)
        if (!value) {
            return interaction.reply({ content: `Please Enter a valid value!` })
        }
        let resp;
        try {

            resp = math.eval(value);
        } catch (e) {
            return interaction.reply({content:`${e.message}`, ephemeral:true});
        }

        const embed = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle("Calculator")
            .addFields([
                { name: "Input", value: `\`\`\`js\n${value}\`\`\`` },
                { name: "Output", value: `\`\`\`js\n${resp}\`\`\`` },
            ]);
        return interaction.reply({ embeds: [embed] });
    },
};
