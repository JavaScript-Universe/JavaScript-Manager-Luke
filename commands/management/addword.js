const moment = require("moment");
const Enmap = require("enmap");
require("moment-duration-format");

module.exports = {
  name: "addword",
  category: "Management",
  aliases: [],
  usage: "<word>",
  description: "Add a bad word to the auto mod (only for staff)",
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin)
      return msg.reply(
        `I'm sorry but you have to be in the management team to use this command!`
      );
    let word = args[0];
    if (!word)
      return msg.reply("Please use the command like this: !addword <word>");
    word = word.toLowerCase();
    if (new Enmap({ name: "badWords" }).has(word))
      return msg.reply(
        `The bad word \`${word}\` was already added to the list, you can remove it by doing \`${prefix}delword <word>\`!`
      );
    new Enmap({ name: "badWords" }).set(word, "true");
    return msg.reply(
      `You successfully added the bad word \`${word}\` to the list`
    );
  },
};
