const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'warns',
  category: 'Utility',
  aliases: [],
  usage: '<User ID (only for staff)>',
  description: 'Get a list of cases',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const warnsDB = new Enmap({ name: 'warns' });
    const user = msg.mentions.members.first() || msg.guild.member(args[0]) || msg.member;
    warnsDB.ensure(user.id, {points: 0, warns: {}});
    if (user.id == msg.member.id) {
      const em = new MessageEmbed()
      .setTitle("Warnings")
      .setColor(color)
      .setDescription(`\`${Object.keys(warnsDB.get(user.id).warns).length != 0 ? Object.keys(warnsDB.get(user.id).warns).join('\n') : 'You have not been warned before'}\``)
      .setFooter("To see the reason of a case, run .warning <Case ID>")
      .setTimestamp();
      await msg.member.send(em).catch(err => msg.reply("Please enable your dms with this server to that I can send you the information you requested!"));
      await msg.channel.send(new MessageEmbed().setColor(color).setDescription("I have sent you a dm with your requested information!")).then(msg => msg.delete({ timeout: 10000 }));
      return msg.delete({ timeout: 1000 });
    } else {
      if (!moderation) return msg.reply('You have to be with the moderation team to be able to view someone elses warnings!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
      const em = new MessageEmbed()
      .setTitle("Warnings")
      .setColor(color)
      .setDescription(`\`${Object.keys(warnsDB.get(user.id).warns).length != 0 ? Object.keys(warnsDB.get(user.id).warns).join('\n') : 'User has not been warned before'}\``)
      .setFooter("To see the reason of a case, run .warning <Case ID>")
      .setTimestamp();
      await msg.member.send(em).catch(err => msg.reply("Please enable your dms with this server to that I can send you the information you requested!"));
      await msg.channel.send(new MessageEmbed().setColor(color).setDescription("I have sent you a dm with your requested information!")).then(msg => msg.delete({ timeout: 10000 }));
      return msg.delete({ timeout: 1000 });
    }
  }
}