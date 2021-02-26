const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'delword',
  category: 'Management',
  aliases: [],
  usage: '<word>',
  description: 'Delete a bad word from auto mod (staff only)',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin) return msg.reply(`I'm sorry but you have to be in the management team to use this command!`);
    let word = args[0];
    if (!word) return msg.reply('Please use the command like this: !delword <word>');
    word = word.toLowerCase()
    if (!new Enmap({ name: 'badWords' }).has(word)) return msg.reply(`The bad word \`${word}\` doesn't exist!`)
    new Enmap({ name: 'badWords' }).delete(word);
    return msg.reply(`You successfully removed the bad word \`${word}\` from the list`);
  }
}