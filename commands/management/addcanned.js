const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'addcanned',
  category: 'Management',
  aliases: [],
  usage: '<prefix> <\\`canned message\\`>',
  description: 'Add a canned message for warn (only for staff)',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin) return msg.reply(`I'm sorry but you have to be in the management team to use this command!`);
    if (!args[0]) return msg.reply('Please use the command like this: .addinfo <prefix> <canned message>');
    const cannedName = args[0];
    if (!args.join(' ').replace(args[0], '').includes('`')) return msg.reply('Please put the canned message in a single backtick codeblock \`like this\`');
    let cannedMsg = args.join(' ').replace(args[0], '').replace(/\n/g, '\\n').trim();
    cannedMsg = cannedMsg.replace(cannedMsg.charAt(0), '');
    cannedMsg = cannedMsg.replace(/.$/, '');
    cannedMsg = cannedMsg.trim();
    if (new Enmap({ name: 'cannedMsgs' }).has(cannedName)) return msg.reply(`There already is a canned message with the prefix \`${cannedName}\`. Please delete it first using \`.delcanned <prefix>\``)
    new Enmap({ name: 'cannedMsgs' }).set(cannedName, cannedMsg);
    return msg.reply(`You successfully added a canned message with the prefix \`${cannedName}\``);
  }
}