const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'addinfo',
  category: 'Utility',
  aliases: [],
  usage: '<tag> <\\`info\\`>',
  description: 'Add a tag (only for staff)',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!staff) return msg.reply(`I'm sorry but you have to be in the staff team to use this command!`);
    if (!args[0]) return msg.reply('Please use the command like this: .addinfo <tag> <info>');
    const infoName = args[0];
    if (!args.join(' ').replace(args[0], '').includes('`')) return msg.reply('Please put the info in a single backtick codeblock \`like this\`');
    let info = args.join(' ').replace(args[0], '').replace(/\n/g, '\\n').trim();
    info = info.replace(info.charAt(0), '');
    const infoLen = info.length;
    info = info.replace(/.$/, '');
    info = info.trim();
    if (new Enmap({ name: 'infos' }).has(infoName)) return msg.reply(`There already is an info with the tag \`${infoName}\`. Please delete it first using \`.delinfo <tag>\``)
    new Enmap({ name: 'infos' }).set(infoName, info);
    return msg.reply(`You successfully added info with the tag \`${infoName}\``);
  }
}