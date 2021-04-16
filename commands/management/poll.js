const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'poll',
  category: 'Management',
  aliases: [],
  usage: '<poll>',
  description: 'Send a poll to the polls channel',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!admin) return msg.reply("I'm sorry but you have to be a community manager to use this command!").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    const pollChan = client.channels.cache.get('721905420557615114');
    if (!args) return msg.reply("Make sure to include a description for the poll message!");
    const pollDesc = args.join(' ').trim();
    const em = new MessageEmbed()
    .setColor(color)
    .setDescription(pollDesc)
    .setFooter('👍 Like | 👎 Dislike');
    await pollChan.send('<@&740250603900371016>')
    await pollChan.send(em).then(async (msg) => {
      await msg.react("👍");
      await msg.react("👎");
    })
    return msg.reply("Succesfully made the poll!").then(async (m) => {
      await msg.delete({ timeout: 2000 });
      await m.delete({ timeout: 5000 })
    })
  }
}