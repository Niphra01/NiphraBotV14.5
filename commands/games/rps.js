const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle ,ComponentType } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Rock, Paper, Scissors'),
  category: 'games',
  async execute(interaction) {
    const reactions = ["rock", "paper", "scissors"];
    const botChoice = reactions[Math.floor(Math.random() * reactions.length)];
    let embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Rock Paper Scissors")
      .setDescription("Play Rock, Paper, Scissors with me!");

    const buttons = new Buttons;
    const replies = new Replies;
    let row1 = buttons.row1();

    const reply = await replies.firstReply(interaction, embed, row1)
    const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
    collector.on('collect', async (collected) => {
      switch (collected.customId) {
        case "rock":
          if (botChoice === "rock") {
            replies.tie(interaction,embed);
          } else if (botChoice === "paper") {
            replies.lose(interaction,embed);
          } else {
            replies.win(interaction,embed);
          }
          break;
        case "paper":
          if (botChoice === "paper") {
            replies.tie(interaction,embed);
          } else if (botChoice === "scissors") {
            replies.lose(interaction,embed);;
          } else {
            replies.win(interaction,embed);
          }
          break;
        case "scissors":
          if (botChoice === "scissors") {
            replies.tie(interaction,embed);
          } else if (botChoice === "rock") {
            replies.lose(interaction,embed);
          } else {
            replies.win(interaction,embed);
          }
          break;
      }
      collector.stop('over');
    })
    collector.on('end', (reason) => {
      if (reason === "time") {
        return interaction.editReply("Game finished cause the timer dropped 0.")
      }
      else if (reason === 'over') {
      }
    })
    //   const rpsR = await interaction.reply({ embeds: [embed], fetchReply: true });

    //   await rpsR.react("🗻");
    //   await rpsR.react("📄");
    //   await rpsR.react("✂️");


    //   const filter = (reaction, user) =>
    //     ["🗻", "📄", "✂️"].includes(reaction.emoji.name) &&
    //     user.id === interaction.user.id &&
    //     !user.bot;

    //   await rpsR
    //     .awaitReactions({
    //       filter,
    //       max: 1,
    //       time: 10000,
    //     })
    //     .then((collected) => {
    //       const reaction = collected.first();
    //       const emoji = reaction.emoji.name;
    //       switch (emoji) {
    //         case "🗻":
    //           if (botChoice === "rock") {
    //             interaction.editReply({ embeds: [embed.setDescription("It's a tie!")] });
    //           } else if (botChoice === "paper") {
    //             interaction.editReply({ embeds: [embed.setDescription("I win!")] });
    //           } else {
    //             interaction.editReply({ embeds: [embed.setDescription("You win!")] });
    //           }
    //           break;
    //         case "📄":
    //           if (botChoice === "paper") {
    //             interaction.editReply({ embeds: [embed.setDescription("It's a tie!")] });
    //           } else if (botChoice === "scissors") {
    //             interaction.editReply({ embeds: [embed.setDescription("I win!")] });
    //           } else {
    //             interaction.editReply({ embeds: [embed.setDescription("You win!")] });
    //           }
    //           break;
    //         case "✂️":
    //           if (botChoice === "scissors") {
    //             interaction.editReply({ embeds: [embed.setDescription("**It's a tie!**")] });
    //           } else if (botChoice === "rock") {
    //             interaction.editReply({ embeds: [embed.setDescription("**I win!**")] });
    //           } else {
    //             interaction.editReply({ embeds: [embed.setDescription("**You win!**")] });
    //           }
    //           break;
    //         default:
    //           interaction.editReply({ embeds: [embed.setDescription("**Times Up, You didn't choose anything.**")] });
    //           break;
    //       }
    //     })
    //     .catch((err) => {
    //       interaction.editReply({ embeds: [embed.setDescription("**Times Up, You didn't choose anything.**")] });
    //     });
  },
};

class Buttons {
  row1() {
    let rock = new ButtonBuilder()
      .setCustomId(`rock`)
      .setLabel('Rock')
      .setStyle(ButtonStyle.Primary)
    let paper = new ButtonBuilder()
      .setCustomId(`paper`)
      .setLabel('Paper')
      .setStyle(ButtonStyle.Primary)
    let scissors = new ButtonBuilder()
      .setCustomId(`scissors`)
      .setLabel('Scissors')
      .setStyle(ButtonStyle.Primary)

    return new ActionRowBuilder()
      .addComponents(rock, paper, scissors)
  }
}

class Replies {

  firstReply(interaction, embed, row1) {
    return interaction.reply({ embeds: [embed], components: [row1] })
  }
  tie(interaction, embed) {
    return interaction.editReply({ embeds: [embed.setDescription("It's a tie")], components: []  })
  }
  win(interaction, embed) {
    return interaction.editReply({ embeds: [embed.setDescription(`You win.`)], components: []  })
  }
  lose(interaction, embed) {
    return interaction.editReply({ embeds: [embed.setDescription(`I win.`)] , components: [] })
  }

}