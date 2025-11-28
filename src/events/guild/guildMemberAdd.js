const { Events, EmbedBuilder } = require('discord.js');
const embed = new EmbedBuilder()

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            let role = member.guild.roles.cache.find(
                (role) => role.name === "Yeni Üye");
                embed.setColor('Purple'),
                embed.setThumbnail(member.user.displayAvatarURL()),
                embed.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                member.guild.channels.cache
                    .get("617071160957337638")
                    .send({content:`**Welcome** <@${member.user.id}>.`, embeds:[embed]});
            member.roles.add(role);

        } catch (err) {
        }
    },
};


