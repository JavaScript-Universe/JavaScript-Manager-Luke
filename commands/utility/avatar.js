const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'avatar',
  category: 'Utility',
  aliases: ['av'],
  usage: '<ID/@mention/username/tag/nickname>',
  description: 'Show an avatar',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const server = msg.guild;
    let member;
    if (!args[0]) member = msg.member;
    if (args[0]) member = server.members.cache.get(args[0]) || 
    server.members.cache.find(m => m.user.username.toLowerCase() == args[0].toLowerCase()) || 
    server.members.cache.find(m => m.user.tag.toLowerCase() == args[0].toLowerCase()) || 
    server.members.cache.find(m => m.displayName.toLowerCase() == args[0].toLowerCase()) || 
    msg.mentions.members.first() || msg.member;
    const em = new MessageEmbed()
    .setColor(color)
    .setTitle(`Showing ${member.displayName}'s avatar`)
    .setImage(member.user.displayAvatarURL({ format: 'png', dynamic: true }));
    if (msg.member.id != member.id) {
      em.setFooter(`Requested by ${msg.member.displayName}`);
    }
    msg.channel.send(em);
  }
}