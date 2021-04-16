const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'clearwarn',
  category: 'Management',
  aliases: [],
  usage: '<User ID> <Case ID>',
  description: 'Clear a warning of a user',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin) return msg.reply("I'm sorry but you have to be a community manager to use this command!").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    const warnsDB = new Enmap({ name: 'warns' });
    if (args[0] && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]).catch(err => err);
    }
    const user = client.users.cache.get(args[0]);
    if (!user) return msg.reply("Please insert the user of whom you want to clear the warning, please note that if they were previously banned that they will be unbanned.").then(d => d.delete({ timeout: 12000 })).then(msg.delete({ timeout: 3000 }));
    warnsDB.ensure(user.id, {points: 0, warns: {}});
    const caseID = args[1];
    if (!caseID) return msg.reply("Please insert the ID of the case you want to clear of this user!").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    if (!warnsDB.get(user.id).warns[caseID]) return msg.reply("I could not find a case with this ID, please make sure you filled it in correctly (case senstive)").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    const casePoints = warnsDB.get(user.id).warns[caseID].points;
    const caseReason = warnsDB.get(user.id).warns[caseID].reason;
    const newPoints = warnsDB.get(user.id).points - casePoints;
    warnsDB.delete(user.id, `warns.${caseID}`);
    warnsDB.set(user.id, newPoints, 'points');
    const userBanned = warnsDB.get(user.id).points < 5;
    if (userBanned) {
      client.guilds.cache.get(user.id).members.unban(user.id, `${msg.author.tag} - warnings cleared`).catch(err => err);
    }
    const clearedWarnsLog = client.channels.cache.get('761006641373118474');
    const em = new MessageEmbed()
    .setTitle("Warning cleared")
    .setColor("GREEN")
    .addField("Manager", `${msg.author.tag} (${msg.author.id})`)
    .addField("User", `${user.tag} (${user.id})`)
    .addField("Case ID", `\`${caseID}\``)
    .addField("Case Points", `\`${parseInt(casePoints).toLocaleString()}\``)
    .addField("Case Reason", `\`${caseReason}\``)
    .addField("Unbanned?", userBanned ? 'Yes' : 'No')
    .setFooter(`By: ${msg.author.tag}`)
    .setTimestamp();
    await clearedWarnsLog.send(em);
    return msg.channel.send(new MessageEmbed().setColor(color).setDescription(`I have successfully cleared warning **${caseID}** from **${user.tag}**!`)).then(msg => msg.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
  }
}