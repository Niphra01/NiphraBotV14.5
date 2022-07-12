const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
const words = require('../../src/WordList.json')
let user = []
module.exports = {
    name: "wordle",
    description: "Wordle Game - Try to find words with 5 letter",
    async execute(client, message, args) {
        const alphabetEN = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "y", "z"]
        const alphabetTR = ["a", "b", "c", "ç", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "ö", "p", "r", "s", "ş", "t", "u", "ü", "v", "y", "z"]
        let randomWord, randomLetter, blackListedWords = [], guesses = [], tempWord = []

        if (args[0] === undefined || args[0].length != 2) {
            return message.reply({ content: "Type your language first `tr`,`en`" })
        } else {

            if (args[0] === "tr") {
                randomLetter = alphabetTR[Math.floor(Math.random() * alphabetTR.length)]
                randomWord = words.tr[randomLetter][Math.floor(Math.random() * words.tr[randomLetter].length)]
            }
            else if (args[0] === "en") {
                randomLetter = alphabetEN[Math.floor(Math.random() * alphabetEN.length)]
                randomWord = words.en[randomLetter][Math.floor(Math.random() * words.en[randomLetter].length)]
            }

            if (user.some(u => u === message.author.id)) {
                message.reply({ content: `You already started the game give your answer without -wordle` })
            } else {

                console.log(user)
                console.log(randomWord)

                user.push(message.author.id)

                const canvas = Canvas.createCanvas(330, 397);
                const context = canvas.getContext('2d');

                const background = await Canvas.loadImage('./src/images/BlankImage.png');
                context.drawImage(background, 0, 0, canvas.width, canvas.height);

                context.font = '42px Clear Sans, Helvetica Neue, Arial, sans-serif';
                context.textAlign = 'center'
                context.fillStyle = '#d7dadc';

                const emptySquare = await Canvas.loadImage('./src/images/EmptySquare.png');

                let squareSize = 62;
                let rowOffset = 0;
                let buffer = 0;


                for (var j = 0; j < 6; j++) {
                    for (var i = 0; i < 5; i++) {
                        context.drawImage(emptySquare, i * squareSize + buffer, rowOffset, squareSize, squareSize);
                        if (guesses[j] != undefined) {
                            context.fillText(guesses[j].charAt(i), (squareSize / 2) + buffer + squareSize * i, rowOffset + 45);
                        }

                        buffer += 5;
                    }

                    buffer = 0;
                    rowOffset += squareSize + 5;
                }
                const BlEmbed = new MessageEmbed().setTitle(`Blacklisted Words: ${blackListedWords.toString().toUpperCase()}`)
                const attachment = new MessageAttachment(canvas.toBuffer(), 'wordle.png');
                message.reply({ embeds: [BlEmbed], files: [attachment] });

                const filter = (m) => (m.author.id === message.author.id);
                const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                collector.on('collect', async collected => {

                    let value = collected.content
                    if (value.length != 5) { return message.reply({ content: "You need to type word with 5 letter" }) }
                    if (guesses == "") {
                        guesses[0] = value;
                    }
                    else {
                        guesses.push(value);
                    }

                    const canvas = Canvas.createCanvas(330, 397);
                    const context = canvas.getContext('2d');

                    const background = await Canvas.loadImage('./src/images/BlankImage.png');
                    context.drawImage(background, 0, 0, canvas.width, canvas.height);

                    context.font = '42px Clear Sans, Helvetica Neue, Arial, sans-serif';
                    context.textAlign = 'center'
                    context.fillStyle = '#d7dadc';


                    const absentSquare = await Canvas.loadImage('./src/images/ColorAbsent.png');
                    const emptySquare = await Canvas.loadImage('./src/images/EmptySquare.png');
                    const greenSquare = await Canvas.loadImage('./src/images/GreenSquare.png');
                    const yellowSquare = await Canvas.loadImage('./src/images/YellowSquare.png');
                    let square = absentSquare;

                    let squareSize = 62;
                    let rowOffset = 0;
                    let buffer = 0;

                    for (var j = 0; j < 6; j++) {
                        for (var i = 0; i < 5; i++) {

                            let imageNumber
                            if (guesses[j] === undefined) { imageNumber = 0; }
                            //letter is in word at same spot
                            else if (guesses[j].charAt(i) == randomWord.charAt(i)) {
                                imageNumber = 1;
                            }
                            //letter is in word at different spot
                            else if (randomWord.includes(guesses[j].charAt(i))) {
                                imageNumber = 2;
                            }
                            //letter is not in word
                            else {
                                imageNumber = 3;

                                if (guesses[j] === value) {
                                    if (blackListedWords.some(el => el.includes(value[i]))) {
                                    } else {
                                        blackListedWords.push(value[i])
                                    }

                                }
                            }

                            if (imageNumber == 0) { square = emptySquare; }
                            else if (imageNumber == 1) { square = greenSquare; }
                            else if (imageNumber == 2) { square = yellowSquare; }
                            else if (imageNumber == 3) { square = absentSquare; }

                            context.drawImage(square, i * squareSize + buffer, rowOffset, squareSize, squareSize);
                            if (guesses[j] != undefined) {
                                context.fillText(guesses[j].charAt(i), (squareSize / 2) + buffer + squareSize * i, rowOffset + 45);
                            }

                            buffer += 5;
                        }

                        buffer = 0;
                        rowOffset += squareSize + 5;
                    }
                    const BlEmbed = new MessageEmbed().setTitle(`Blacklisted Words: ${blackListedWords.toString().toUpperCase()}`)
                    const attachment2 = new MessageAttachment(canvas.toBuffer(), 'wordle.png');
                    await message.reply({ embeds: [BlEmbed], files: [attachment2] });

                    if (value === randomWord) {
                        const ResEmbed = new MessageEmbed().setTitle(`You guess the word. Congrats.`)
                        message.reply({ embeds: [ResEmbed] })
                        user.splice(user.indexOf(message.author.id), 1)
                        collector.stop()
                    }
                    else if (guesses.length === 6) {
                        const ResEmbed = new MessageEmbed().setTitle(`You didn't find the word. The word was: ${randomWord}`)
                        message.reply({ embeds: [ResEmbed] })
                        user.splice(user.indexOf(message.author.id), 1)
                        collector.stop()
                    }
                });
                collector.on('end', (reason) => {
                    if (reason === "time") {
                        const ResEmbed = new MessageEmbed().setTitle(`You didn't guess at time. The word was: ${randomWord}`)
                        message.reply({ embeds: [ResEmbed] })
                        user.splice(user.indexOf(message.author.id), 1)
                    }
                });
            }
        }
    }
}
