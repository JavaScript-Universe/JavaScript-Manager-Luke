const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'delcanned',
  category: 'Management',
  aliases: [],
  usage: '<prefix>',
  description: 'Delete a canned message (staff only)',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin) return msg.reply(`I'm sorry but you have to be in the management team to use this command!`);
    if (!args[0]) return msg.reply('Please use the command like this: .delcanned <prefix>');
    const infoName = args[0];
    if (!new Enmap({ name: 'cannedMsgs' }).has(infoName)) return msg.reply(`The tag \`${infoName}\` doesn't exist.`)
    new Enmap({ name: 'cannedMsgs' }).delete(infoName);
    return msg.reply(`You successfully deleted the prefix \`${infoName}\``);
  }
}