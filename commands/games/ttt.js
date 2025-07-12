const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ttt")
    .setDescription("Simple Tic-Tac-Toe Game")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select the user whom you want to play with.")
        .setRequired(true)),
  category: "games",
  async execute(interaction) {

    const buttons = new Buttons;
    const replies = new Replies;

    let row1 = buttons.row1(), row2 = buttons.row2(), row3 = buttons.row3();
    let board = [
      [],
      [],
      []
    ];

    let symbol, count = 0, playerTurn = true;
    let oppenent1 = await interaction.options.getUser("user");
    let player1 = await interaction.user;

    let tttEmbed = await Embed(player1, oppenent1);
    const reply = await replies.firstReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)

    const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 });

    collector.on('collect', async (collected) => {
      count++;

      if (collected.user.id == player1.id && playerTurn) {
        symbol = "X";
        playerTurn = false;
      }
      else if (collected.user.id == oppenent1.id && !playerTurn) {
        symbol = "O";
        playerTurn = true
      }
      else {
        return interaction.followUp({
          content: "You aren't the oppenent/player in this game", ephemeral: true
        });
      }
      switch (collected.customId) {
        case "button1":
          row1.components[0].setDisabled(true);
          row1.components[0].setLabel(symbol);
          board[0][0] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
        case "button2":
          row1.components[1].setDisabled(true)
          row1.components[1].setLabel(symbol);
          board[0][1] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
        case "button3":
          row1.components[2].setDisabled(true)
          row1.components[2].setLabel(symbol);
          board[0][2] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
        case "button4":
          row2.components[0].setDisabled(true)
          row2.components[0].setLabel(symbol);
          board[1][0] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
        case "button5":
          row2.components[1].setDisabled(true)
          row2.components[1].setLabel(symbol);
          board[1][1] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
        case "button6":
          row2.components[2].setDisabled(true)
          row2.components[2].setLabel(symbol);
          board[1][2] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
        case "button7":
          row3.components[0].setDisabled(true)
          row3.components[0].setLabel(symbol);
          board[2][0] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
        case "button8":
          row3.components[1].setDisabled(true)
          row3.components[1].setLabel(symbol);
          board[2][1] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
        case "button9":
          row3.components[2].setDisabled(true)
          row3.components[2].setLabel(symbol);
          board[2][2] = symbol;
          replies.normalReply(interaction, tttEmbed, await DrawTicTacToe(board), row1, row2, row3)
          break;
      }

      await 1500;

      if ((board[0][0] === board[0][1] && board[0][0] === board[0][2] && board[0][0] != null ||
        board[1][0] == board[1][1] && board[1][0] == board[1][2] && board[1][0] != null ||
        board[2][0] == board[2][1] && board[2][0] == board[2][2] && board[2][0] != null ||
        board[0][0] == board[1][0] && board[0][0] == board[2][0] && board[0][0] != null ||
        board[0][1] == board[1][1] && board[0][1] == board[2][1] && board[0][1] != null ||
        board[0][2] == board[1][2] && board[0][2] == board[2][2] && board[0][2] != null ||
        board[0][0] == board[1][1] && board[0][0] == board[2][2] && board[0][0] != null ||
        board[0][2] == board[1][1] && board[0][2] == board[2][0] && board[0][2] != null)
      ) {
        if (symbol == "X") {
          replies.win(interaction, tttEmbed, player1, null, await DrawTicTacToe(board))
        } else {
          replies.win(interaction, tttEmbed, null, oppenent1, await DrawTicTacToe(board))
        }

        collector.stop("over");
      } else if (count == 9) {
        replies.tie(interaction, tttEmbed, await DrawTicTacToe(board))
        collector.stop("over");
      }
    });
    collector.on('end', (collected, reason) => {
      board = [
        [],
        [],
        []
      ];
      if (reason === "time") {
        return interaction.editReply("Game finished cause the timer dropped 0.")
      }
      else if(reason === 'over'){
      }
    });
  }
}

const Embed = (player1, oppenent1) => {

  const tttEmbed = new EmbedBuilder()
    .setTitle("Tic-Tac-Toe")
    .setDescription(`${player1} vs ${oppenent1}`)
    .setImage(`attachment://ttt.png`)

  return tttEmbed;
}

const DrawTicTacToe = async (board) => {
  const canvas = Canvas.createCanvas(201, 215);
  const context = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "./src/images/BlankImage.png"
  );
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.font = "42px Clear Sans, Helvetica Neue, Arial, sans-serif";
  context.textAlign = "center";
  context.fillStyle = "#d7dadc";

  const emptySquare = await Canvas.loadImage(
    "./src/images/EmptySquare.png"
  );

  let squareSize = 62;
  let rowOffset = 0;
  let buffer = 0;

  for (var j = 0; j < 3; j++) {
    for (var i = 0; i < 3; i++) {
      context.drawImage(
        emptySquare,
        i * squareSize + buffer,
        rowOffset,
        squareSize,
        squareSize
      );
      if (board[j][i] != undefined) {
        context.fillText(
          board[j][i],
          squareSize / 2 + buffer + squareSize * i,
          rowOffset + 45
        );
      }

      buffer += 5;
    }

    buffer = 0;
    rowOffset += squareSize + 5;
  }


  return new AttachmentBuilder(canvas.toBuffer(), {
    name: "ttt.png",
  });

}


class Buttons {
  row1() {
    let button1 = new ButtonBuilder()
      .setCustomId(`button1`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)
    let button2 = new ButtonBuilder()
      .setCustomId(`button2`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)
    let button3 = new ButtonBuilder()
      .setCustomId(`button3`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)

    return new ActionRowBuilder()
      .addComponents(button1, button2, button3)
  }
  row2() {
    let button4 = new ButtonBuilder()
      .setCustomId(`button4`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)
    let button5 = new ButtonBuilder()
      .setCustomId(`button5`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)
    let button6 = new ButtonBuilder()
      .setCustomId(`button6`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)

    return new ActionRowBuilder()
      .addComponents(button4, button5, button6)
  }
  row3() {
    let button7 = new ButtonBuilder()
      .setCustomId(`button7`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)
    let button8 = new ButtonBuilder()
      .setCustomId(`button8`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)
    let button9 = new ButtonBuilder()
      .setCustomId(`button9`)
      .setLabel(`-`)
      .setStyle(ButtonStyle.Primary)

    return new ActionRowBuilder()
      .addComponents(button7, button8, button9)
  }
}

class Replies {

  firstReply(interaction, tttEmbed, attachment, row1, row2, row3) {
    return interaction.reply({ embeds: [tttEmbed], files: [attachment], components: [row1, row2, row3] })
  }
  tie(interaction, tttEmbed, attachment) {
    return interaction.editReply({ embeds: [tttEmbed.setDescription("It's a tie")], files: [attachment], components: [] })
  }
  win(interaction, tttEmbed, player1, oppenent1, attachment) {
    return interaction.editReply({ embeds: [tttEmbed.setDescription(`${player1 ? player1 : oppenent1} win.`)], files: [attachment], components: [] })
  }
  normalReply(interaction, tttEmbed, attachment, row1, row2, row3) {
    return interaction.editReply({ embeds: [tttEmbed], files: [attachment], components: [row1, row2, row3] })
  }

}