const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, userMention } = require("discord.js");
const Canvas = require("canvas");
const words = require("../../src/configs/WordList.json");
let user = [];
module.exports = {
  data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Wordle Game - Try to find words with 5 letter')
    .addStringOption(option =>
      option.setName('language')
        .setDescription('Select the language for the game')
        .setChoices({ name: "English", value: 'en' }, { name: 'Turkish', value: 'tr' })
        .setRequired(true)
    ),
  category: 'games',
  async execute(interaction) {
    const alphabetEN = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "y",
      "z",
    ];
    const alphabetTR = [
      "a",
      "b",
      "c",
      "ç",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "ö",
      "p",
      "r",
      "s",
      "ş",
      "t",
      "u",
      "ü",
      "v",
      "y",
      "z",
    ];
    let randomWord,
      randomLetter,
      blackListedWords = [],
      guesses = [],
      lang,
      isWord,
      tempWord = [];

    lang = interaction.options.getString('language', true)
    if (user.some((u) => u === interaction.user.id)) {
      return interaction.reply({
        content: `You already started the game type your guess.`, ephemeral: true
      });
    } else {
      if (lang === "tr") {
        randomLetter =
          alphabetTR[Math.floor(Math.random() * alphabetTR.length)];
        randomWord =
          words[lang][randomLetter][
          Math.floor(Math.random() * words[lang][randomLetter].length)
          ];
      } else if (lang === "en") {
        randomLetter =
          alphabetEN[Math.floor(Math.random() * alphabetEN.length)];
        randomWord =
          words[lang][randomLetter][
          Math.floor(Math.random() * words[lang][randomLetter].length)
          ];
      }

      user.push(interaction.user.id);
      const canvas = Canvas.createCanvas(330, 397);
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

      for (var j = 0; j < 6; j++) {
        for (var i = 0; i < 5; i++) {
          context.drawImage(
            emptySquare,
            i * squareSize + buffer,
            rowOffset,
            squareSize,
            squareSize
          );
          if (guesses[j] != undefined) {
            context.fillText(
              guesses[j].charAt(i),
              squareSize / 2 + buffer + squareSize * i,
              rowOffset + 45
            );
          }

          buffer += 5;
        }

        buffer = 0;
        rowOffset += squareSize + 5;
      }
      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "wordle.png",
      });

      const BlEmbed = Embed(interaction,lang,`Blacklisted Words: ${blackListedWords.toString().toUpperCase()}`); 
      
      await interaction.reply({ embeds: [BlEmbed], files: [attachment] })

      const filter = (m) => m.author.id === interaction.user.id;   
      const collector = interaction.channel.createMessageCollector({
        filter,
        time: 300000,
      });
      collector.on("collect", async (collected) => {
        let value = collected.content.toLowerCase();
        if (value.length != 5) {
          await interaction.channel.bulkDelete(1)
          return interaction.followUp({
            content: "You need to type word with 5 letter", ephemeral: true
          });
        }

        Object.keys(words[lang]).forEach((letter) => {
          Object.keys(words[lang][letter]).forEach((word) => {
            if (words[lang][letter][word].toString() === value.toString()) {
              return (isWord = true);
            }
          });
        });

        if (!isWord) {
          await interaction.channel.bulkDelete(1)
          return interaction.followUp({ content: `Word **${value}** not in my library`, ephemeral: true });
        }
        if (guesses == "") {
          guesses[0] = value;
        } else {
          guesses.push(value);
        }

        const canvas = Canvas.createCanvas(330, 397);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage(
          "./src/images/BlankImage.png"
        );
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.font = "42px Clear Sans, Helvetica Neue, Arial, sans-serif";
        context.textAlign = "center";
        context.fillStyle = "#d7dadc";

        const absentSquare = await Canvas.loadImage(
          "./src/images/ColorAbsent.png"
        );
        const emptySquare = await Canvas.loadImage(
          "./src/images/EmptySquare.png"
        );
        const greenSquare = await Canvas.loadImage(
          "./src/images/GreenSquare.png"
        );
        const yellowSquare = await Canvas.loadImage(
          "./src/images/YellowSquare.png"
        );
        let square = absentSquare;

        let squareSize = 62;
        let rowOffset = 0;
        let buffer = 0;

        for (var j = 0; j < 6; j++) {
          tempWord = randomWord.split("");
          for (var i = 0; i < 5; i++) {
            let imageNumber;
            if (guesses[j] === undefined) {
              imageNumber = 0;
            }
            //letter is in word at same spot
            else if (guesses[j].charAt(i) == randomWord.charAt(i)) {
              imageNumber = 1;
            }

            //letter is in word at different spot
            else if (
              tempWord.filter((x) => x.includes(guesses[j].charAt(i)))
                .length === 1 &&
              tempWord.includes(guesses[j].charAt(i))
            ) {
              var total = 0;
              for (var x = 0; x < 5; x++) {
                if (
                  guesses[j].charAt(x) == tempWord[x] &&
                  guesses[j].charAt(i) == tempWord[x]
                ) {
                  total += 1; //1 tane zaten bulunmuş
                }
              }
              tempWord.splice(tempWord.indexOf(guesses[j].charAt(i)), 1);
              imageNumber = total > 0 ? 3 : 2;
            } else if (
              tempWord.filter((x) => x.includes(guesses[j].charAt(i)))
                .length > 1 &&
              tempWord.includes(guesses[j].charAt(i))
            ) {
              tempWord.splice(tempWord.indexOf(guesses[j].charAt(i)), 1);
              imageNumber = 2;
            }

            //letter is not in word
            else {
              imageNumber = 3;
              if (guesses[j] === value) {
                if (blackListedWords.some((el) => el.includes(value[i]))) {
                } else {
                  blackListedWords.push(value[i]);
                }
              }
            }

            if (imageNumber == 0) {
              square = emptySquare;
            } else if (imageNumber == 1) {
              square = greenSquare;
            } else if (imageNumber == 2) {
              square = yellowSquare;
            } else if (imageNumber == 3) {
              square = absentSquare;
            }

            context.drawImage(
              square,
              i * squareSize + buffer,
              rowOffset,
              squareSize,
              squareSize
            );
            if (guesses[j] != undefined) {
              context.fillText(
                guesses[j].charAt(i),
                squareSize / 2 + buffer + squareSize * i,
                rowOffset + 45
              );
            }

            buffer += 5;
          }
          tempWord = [];
          buffer = 0;
          rowOffset += squareSize + 5;
        }
        await interaction.channel.bulkDelete(1)


        const attachment2 = new AttachmentBuilder(canvas.toBuffer(), {
          name: "wordle.png",
        });

        const BlEmbed = Embed(interaction,lang,`Blacklisted Words: ${blackListedWords.toString().toUpperCase()}`);       
        await interaction.editReply({ embeds: [BlEmbed], files: [attachment2]});
        
        isWord = false;

        if (value === randomWord) {

          const BlEmbed = Embed(interaction,lang,`You guess the word. Congrats.`);
          await interaction.editReply({ embeds: [BlEmbed] ,files: [attachment2] });
          collector.stop("over");
        } else if (guesses.length === 6) {
          
          const BlEmbed = Embed(interaction,lang,`You didn't find the word. The word was: ${randomWord}`);
          await interaction.editReply({ embeds: [BlEmbed] ,files: [attachment2] });
          collector.stop("over");
        }
      });
      collector.on("end", async (reason) => {
        if (reason === "time") {
          const BlEmbed = Embed(interaction,lang,`$You didn't guess the word at time. The word was: ${randomWord}`);

          await interaction.editReply({ embeds: [BlEmbed],files: [attachment2] });
          try {
            await user.splice(user.indexOf(interaction.user.id), 1);
          } catch (err) {
          }
        } else if (reason === "over") {
          try {
            await user.splice(user.indexOf(interaction.user.id), 1);
          } catch (err) {
          }
        }
      });
    }

  },
};


const Embed = (interaction,lang,titleValue) => {

  const BlEmbed = new EmbedBuilder()
  .setTitle(titleValue)
  .setAuthor({name:`${interaction.user.username.toUpperCase()}`, iconURL:interaction.user.displayAvatarURL()})
  .setImage(`attachment://wordle.png`)
  .setFooter({text:`Language: ${lang.toUpperCase()}`})

  return BlEmbed;
}