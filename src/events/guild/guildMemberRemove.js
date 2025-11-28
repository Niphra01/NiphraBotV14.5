const { Events, EmbedBuilder } = require('discord.js');
const embed = new EmbedBuilder()

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            embed.setColor('Purple'),
            embed.setThumbnail(member.user.displayAvatarURL()),
            embed.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
            member.guild.channels.cache
                .get("617071160957337638")
                .send({content:`**Goodbye** <@${member.user.id}>.`, embeds:[embed]});
        }
        catch (err) {
        }
    }
};