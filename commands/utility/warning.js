const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'warning',
  category: 'Utility',
  aliases: [],
  usage: '<Case ID> <User ID (only for staff)>',
  description: 'Get information about a case',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const warnsDB = new Enmap({ name: 'warns' });
    const user = client.users.cache.get(args[1]) || msg.member;
    warnsDB.ensure(user.id, {points: 0, warns: {}});
    const caseID = args[0];
    if (!warnsDB.get(user.id).warns[caseID]) return msg.reply("I could not find a case with this ID, please make sure you filled it in correctly (case senstive)").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    if (user.id == msg.member.id) {
      const em = new MessageEmbed()
      .setTitle(caseID)
      .setColor(color)
      .addField("Reason", warnsDB.get(user.id).warns[caseID].reason)
      .addField("Date", warnsDB.get(user.id).warns[caseID].date)
      .setTimestamp();
      await msg.member.send(em).catch(err => msg.reply("Please enable your dms with this server to that I can send you the information you requested!"));
      await msg.channel.send(new MessageEmbed().setColor(color).setDescription("I have sent you a dm with your requested information!")).then(msg => msg.delete({ timeout: 10000 }));
      return msg.delete({ timeout: 1000 });
    } else {
      if (!moderation) return msg.reply('You have to be with the moderation team to be able to view someone elses warning!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
      const em = new MessageEmbed()
      .setTitle(caseID)
      .setColor(color)
      .addField("Reason", warnsDB.get(user.id).warns[caseID].reason)
      .addField("Moderator ID", warnsDB.get(user.id).warns[caseID].moderator)
      .addField("Date", warnsDB.get(user.id).warns[caseID].date)
      .setTimestamp();
      await msg.member.send(em).catch(err => msg.reply("Please enable your dms with this server to that I can send you the information you requested!"));
      await msg.channel.send(new MessageEmbed().setColor(color).setDescription("I have sent you a dm with your requested information!")).then(msg => msg.delete({ timeout: 10000 }));
      return msg.delete({ timeout: 1000 });
    }
  }
}