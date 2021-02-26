const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'clearwarns',
  category: 'Management',
  aliases: [],
  usage: '<User ID>',
  description: 'Clear all warnings of a user',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin) return msg.reply("I'm sorry but you have to be a community manager to use this command!").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    const warnsDB = new Enmap({ name: 'warns' });
    if (args[0] && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]).catch(err => err);
    }
    const user = client.users.cache.get(args[0]);
    if (!user) return msg.reply("Please insert the user of whom you want to clear the warnings, please note that if they were previously banned that they will be unbanned.").then(d => d.delete({ timeout: 12000 })).then(msg.delete({ timeout: 3000 }));
    warnsDB.ensure(user.id, {points: 0, warns: {}});
    const userBanned = warnsDB.get(user.id).points >= 5;
    if (userBanned) {
      client.guilds.cache.get('720661480143454340').members.unban(user.id, `${msg.author.tag} - warnings cleared`);
    }
    warnsDB.delete(user.id);
    const clearedWarnsLog = client.channels.cache.get('761006641373118474');
    const em = new MessageEmbed()
    .setTitle("Warnings cleared")
    .setColor("GREEN")
    .addField("Manager", `${msg.author.tag} (${msg.author.id})`)
    .addField("User", `${user.tag} (${user.id})`)
    .addField("Unbanned?", userBanned ? 'Yes' : 'No')
    .setFooter(`By: ${msg.author.tag}`)
    .setTimestamp();
    await clearedWarnsLog.send(em);
    return msg.channel.send(new MessageEmbed().setColor(color).setDescription(`I have successfully cleared all warnings on **${user.tag}**!`)).then(msg => msg.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
  }
}