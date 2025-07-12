const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('connect4')
        .setDescription('Connect Four Game.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user to play with.')
                .setRequired(true)
        ),
    category: 'games',
    async execute(interaction) {
        let col1 = 0, col2 = 0, col3 = 0, col4 = 0, col5 = 0, col6 = 0, col7 = 0;
        const player1 = interaction.user;
        const oppenent1 = interaction.options.getUser('user');
        let board = [
            [], [], [], [], [], [], []
        ]
        let count = 0, playerTurn = true;
        const buttons = new Buttons;
        const replies = new Replies;
        let row1 = buttons.row1(), row2 = buttons.row2();

        let c4Embed = await Embed(player1, oppenent1);
        const reply = await replies.firstReply(interaction, c4Embed, await DrawConnect4(board), row1, row2)
        const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });

        collector.on('collect', async (collected) => {

            count++;
            if (collected.user.id == player1.id && playerTurn) {
                symbol = "Blue";
                playerTurn = false;
            }
            else if (collected.user.id == oppenent1.id && !playerTurn) {
                symbol = "Red";
                playerTurn = true
            }
            else {
                return interaction.followUp({
                    content: "You aren't the oppenent/player in this game", ephemeral: true
                });
            }
            switch (collected.customId) {
                case "button1":

                    board[0][5 - col1] = symbol;
                    col1++;
                    replies.normalReply(interaction, c4Embed, await DrawConnect4(board), row1, row2)
                    break;
                case "button2":

                    board[1][5 - col2] = symbol;
                    col2++;
                    replies.normalReply(interaction, c4Embed, await DrawConnect4(board), row1, row2)
                    break;
                case "button3":

                    board[2][5 - col3] = symbol;
                    col3++;
                    replies.normalReply(interaction, c4Embed, await DrawConnect4(board), row1, row2)
                    break;
                case "button4":

                    board[3][5 - col4] = symbol;
                    col4++;
                    replies.normalReply(interaction, c4Embed, await DrawConnect4(board), row1, row2)
                    break;
                case "button5":

                    board[4][5 - col5] = symbol;
                    col5++;
                    replies.normalReply(interaction, c4Embed, await DrawConnect4(board), row1, row2)
                    break;
                case "button6":

                    board[5][5 - col6] = symbol;
                    col6++;
                    replies.normalReply(interaction, c4Embed, await DrawConnect4(board), row1, row2)
                    break;
                case "button7":
                    board[6][5 - col7] = symbol;
                    col7++;
                    replies.normalReply(interaction, c4Embed, await DrawConnect4(board), row1, row2)
                    break;
            }

            if (checkHorizontalAndVertical(board) == "Blue" || checkLeftToRightDiagonal(board) == "Blue" || checkRightToLeftDiagonal(board) == "Blue") {
                replies.win(interaction, c4Embed, player1, null, await DrawConnect4(board));
                collector.stop('over')
            } else if(checkHorizontalAndVertical(board) == "Red" || checkLeftToRightDiagonal(board) == "Red" || checkRightToLeftDiagonal(board) == "Red"){
                replies.win(interaction,c4Embed,null,oppenent1, await DrawConnect4(board));
                collector.stop('over')
            }
            else if (count == 42) {
                replies.tie(interaction, c4Embed, await DrawConnect4(board));
                collector.stop('over');
            }
        });
        collector.on('end', (reason) => {
            board = [
                [], [], [], [], [], [], []
            ]
            if (reason === "time") {
                return interaction.editReply("Game finished cause the timer dropped 0.")
            }
            else if (reason === 'over') {
            }
        });
    }
}
const DrawConnect4 = async (board) => {

    const canvas = Canvas.createCanvas(475, 400);
    const context = canvas.getContext("2d");

    const background = await Canvas.loadImage(
        "./src/images/BlankImage.png"
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "42px Clear Sans, Helvetica Neue, Arial, sans-serif";
    context.textAlign = "center";
    context.fillStyle = "#d7dadc";

    const blueCircle = await Canvas.loadImage(
        "./src/images/BlueCircle.png"
    );
    const redCircle = await Canvas.loadImage(
        "./src/images/RedCircle.png"
    );
    const emptyCircle = await Canvas.loadImage(
        "./src/images/EmptyCircle.png"
    );
    let circle = emptyCircle;
    let squareSize = 62;
    let rowOffset = 0;
    let buffer = 0;

    for (var j = 0; j < 6; j++) {
        for (var i = 0; i < 7; i++) {
            if (board[i][j] == 'Red') {
                circle = redCircle;
            } else if (board[i][j] == 'Blue') {
                circle = blueCircle;
            } else {
                circle = emptyCircle;
            }

            context.drawImage(
                circle,
                i * squareSize + buffer,
                rowOffset,
                squareSize,
                squareSize
            );


            buffer += 5;
        }

        buffer = 0;
        rowOffset += squareSize + 5;
    }


    return new AttachmentBuilder(canvas.toBuffer(), {
        name: "c4.png",
    });

}

const Embed = (player1, oppenent1) => {

    const c4Embed = new EmbedBuilder()
        .setTitle("Connect Four")
        .setDescription(`${player1} vs ${oppenent1}`)
        .setImage(`attachment://c4.png`)

    return c4Embed;
}

class Replies {

    firstReply(interaction, c4Embed, attachment, row1, row2) {
        return interaction.reply({ embeds: [c4Embed], files: [attachment], components: [row1, row2] })
    }
    tie(interaction, c4Embed, attachment) {
        return interaction.editReply({ embeds: [c4Embed.setDescription("It's a tie")], files: [attachment], components: [] })
    }
    win(interaction, c4Embed, player1, oppenent1, attachment) {
        return interaction.editReply({ embeds: [c4Embed.setDescription(`${player1 ? player1 : oppenent1} win.`)], files: [attachment], components: [] })
    }
    normalReply(interaction, c4Embed, attachment, row1, row2) {
        return interaction.editReply({ embeds: [c4Embed], files: [attachment], components: [row1, row2] })
    }

}

class Buttons {
    row1() {
        let button1 = new ButtonBuilder()
            .setCustomId(`button1`)
            .setLabel('Col 1')
            .setStyle(ButtonStyle.Primary)
        let button2 = new ButtonBuilder()
            .setCustomId(`button2`)
            .setLabel('Col 2')
            .setStyle(ButtonStyle.Primary)
        let button3 = new ButtonBuilder()
            .setCustomId(`button3`)
            .setLabel('Col 3')
            .setStyle(ButtonStyle.Primary)
        let button4 = new ButtonBuilder()
            .setCustomId(`button4`)
            .setLabel('Col 4')
            .setStyle(ButtonStyle.Primary)
        let button5 = new ButtonBuilder()
            .setCustomId(`button5`)
            .setLabel('Col 5')
            .setStyle(ButtonStyle.Primary)


        return new ActionRowBuilder()
            .addComponents(button1, button2, button3, button4, button5)
    }
    row2() {
        let button6 = new ButtonBuilder()
            .setCustomId(`button6`)
            .setLabel('Col 6')
            .setStyle(ButtonStyle.Primary)
        let button7 = new ButtonBuilder()
            .setCustomId(`button7`)
            .setLabel('Col 7')
            .setStyle(ButtonStyle.Primary)
        return new ActionRowBuilder()
            .addComponents(button6, button7)
    }
}

function checkLeftToRightDiagonal(board, result) {
    for (var y = 0; y < 4; y++) {
        for (var x = 3; x < 6; x++) {
            if (board[y][x] == 'Blue' && board[y + 1][x - 1] == 'Blue' && board[y + 2][x - 2] == 'Blue' && board[y + 3][x - 3] == 'Blue') {
                return "Blue";
            }
            if (board[y][x] == 'Red' && board[y + 1][x - 1] == 'Red' && board[y + 2][x - 2] == 'Red' && board[y + 3][x - 3] == 'Red') {
                return "Red";
            }
        }
    }
}
function checkRightToLeftDiagonal(board, result) {
    for (var y = 6; y > 2; y--) {
        for (var x = 3; x < 6; x++) {
            if (board[y][x] == 'Blue' && board[y - 1][x - 1] == 'Blue' && board[y - 2][x - 2] == 'Blue' && board[y - 3][x - 3] == 'Blue') {

                return "Blue";
            }
            if (board[y][x] == 'Red' && board[y - 1][x - 1] == 'Red' && board[y - 2][x - 2] == 'Red' && board[y - 3][x - 3] == 'Red') {
                return "Red";
            }
        }
    }
}


function checkHorizontalAndVertical(board) {
    for (var x = 0; x < 6; x++) {
        var blueHorizontalConsecutive = 0;
        var redHorizontalConsecutive = 0;
        var blueVerticalConsecutive = 0;
        var redVerticalConsecutive = 0;
        for (var y = 0; y < 7; y++) {
            if (board[y][x] == 'Blue') {
                blueHorizontalConsecutive++;
                if (blueHorizontalConsecutive == 4) {
                    return "Blue";
                }
            }
            else {
                blueHorizontalConsecutive = 0;
            }
            if (board[x][y] == 'Blue') {
                blueVerticalConsecutive++;
                if (blueVerticalConsecutive == 4) {
                    return "Blue";
                }
            }
            else {
                blueVerticalConsecutive = 0;
            }
            if (board[y][x] == 'Red') {
                redHorizontalConsecutive++;
                if (redHorizontalConsecutive == 4) {
                    return "Red";
                }
            }
            else {
                redHorizontalConsecutive = 0;
            }
            if (board[x][y] == 'Red') {
                redVerticalConsecutive++;
                if (redVerticalConsecutive == 4) {
                    return "Red";
                }
            }
            else {
                redVerticalConsecutive = 0;
            }
        }
    }
}