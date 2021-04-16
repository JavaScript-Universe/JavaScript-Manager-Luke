const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'unban',
  category: 'Management',
  aliases: [],
  usage: '<User ID>',
  description: 'ClUnban a user from the main server',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin) return msg.reply("I'm sorry but you have to be a community manager to use this command!").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    const warnsDB = new Enmap({ name: 'warns' });
    if (args[0] && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]).catch(err => err);
    }
    const user = client.users.cache.get(args[0]);
    if (!user) return msg.reply("Please insert the user you want to unban.").then(d => d.delete({ timeout: 12000 })).then(msg.delete({ timeout: 3000 }));
    warnsDB.ensure(user.id, {points: 0, warns: {}});
    client.guilds.cache.get('720661480143454340').members.unban(user.id, `unbanning admin - ${msg.author.tag}`).catch(err => err);
    const clearedWarnsLog = client.channels.cache.get('761006641373118474');
    const em = new MessageEmbed()
    .setTitle("Unbanned")
    .setColor("GREEN")
    .addField("Manager", `${msg.author.tag} (${msg.author.id})`)
    .addField("User", `${user.tag} (${user.id})`)
    .setTimestamp();
    await clearedWarnsLog.send(em);
    return msg.channel.send(new MessageEmbed().setColor(color).setDescription(`I have successfully unbanned **${user.tag}**!`)).then(msg => msg.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
  }
}