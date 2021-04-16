const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'announce',
  category: 'Management',
  aliases: [],
  usage: '<announcement>',
  description: 'Send an announcement to the announcement channel',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin) return msg.reply("I'm sorry but you have to be a community manager to use this command!").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    const announceChan = client.channels.cache.get('720677227427266710');
    await announceChan.messages.fetch();
    if (!args) return msg.reply("Make sure to include a description for the announcement!");
    const pollDesc = args.join(' ').trim();
    const em = new MessageEmbed()
    .setColor(color)
    .setDescription(pollDesc)
    .setTimestamp();
    await announceChan.send('<@&720675080841199636>');
    await announceChan.send(em);
    return msg.reply("Succesfully made the announcement!").then(async (m) => {
      await msg.delete({ timeout: 2000 });
      await m.delete({ timeout: 5000 })
    })
  }
}