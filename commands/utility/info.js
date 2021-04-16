const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'info',
  category: 'Utility',
  aliases: ['i'],
  usage: '<tag>',
  description: 'Get a list of tags or a tag itself',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!args[0]) return msg.channel.send(new MessageEmbed().setTitle("Tags").setColor(color).setDescription(`\`${new Enmap({ name: 'infos' }).keyArray().length != 0 ? new Enmap({ name: 'infos' }).keyArray().join(', ') : 'no tags available'}\``));
    const infoName = args[0];
    if (!new Enmap({ name: 'infos' }).has(infoName)) return msg.channel.send(new MessageEmbed().setTitle("Oops").setColor(color).setDescription(`I could not find info with the tag **${infoName}**. Please run this command without arguments to get a full list of all available tags.`));
    const info = new Enmap({ name: 'infos' }).get(infoName);
    const em = new MessageEmbed()
    .setTitle(infoName.toProperCase())
    .setColor(color)
    .setDescription(info.replace(/\\n/g, '\n'))
    .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`)
    .setTimestamp();
    return msg.channel.send(em);
  }
}