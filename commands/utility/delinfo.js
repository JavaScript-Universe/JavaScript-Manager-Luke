const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'delinfo',
  category: 'Utility',
  aliases: [],
  usage: '<tag>',
  description: 'Delete a tag (staff only)',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!staff) return msg.reply(`I'm sorry but you have to be in the staff team to use this command!`);
    if (!args[0]) return msg.reply('Please use the command like this: .delinfo <tag>');
    const infoName = args[0];
    if (!new Enmap({ name: 'infos' }).has(infoName)) return msg.reply(`The tag \`${infoName}\` doesn't exist.`)
    new Enmap({ name: 'infos' }).delete(infoName);
    return msg.reply(`You successfully deleted the tag \`${infoName}\``);
  }
}