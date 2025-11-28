const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const nodeFetch = require("node-fetch");
require("dotenv").config();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Getting random image from reddit')
        .addStringOption(option =>
            option
                .setName('subreddit')
                .setDescription('Type subreddit')
                .setRequired(true)),
    category: 'utility',
    async execute(interaction) {
        let subreddit = interaction.options.getString('subreddit', true)

        await interaction.deferReply();

        const targetURL = `https://reddit.com/r/${subreddit}/new/.json?limit=100`;
        const resp = await nodeFetch(targetURL, {
            Header: { "user-agent": process.env.USERAGENT },
        });

        const body = await resp.json();
        const allowed = interaction.channel.nsfw
            ? body.data.children.filter((child) => child.data.media === null)
            : body.data.children.filter(
                (child) => !child.data.over_18 && child.data.media === null
            );
        if (!allowed.length) {
            return interaction.reply({
               content: "It seems we are out of fresh memes!, Try again later.",ephemeral:true
            });
        }

        const randomNumber = Math.floor(Math.random() * allowed.length);
        const post = allowed[randomNumber].data;
        const embed = new EmbedBuilder()
            .setTitle(post.title)
            .setURL(`https://reddit.com${post.permalink}`)
            .setImage(post.url.replace(".gifv", ".gif"))
            .setFooter({ text: `r/${subreddit} | Requsted by ${interaction.user.tag}` });
        return await interaction.followUp({ embeds: [embed] });
    },
};