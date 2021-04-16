const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'fetch',
  category: 'Utility',
  aliases: [],
  usage: '<User ID (only for staff)>',
  description: 'Fetch a user by ID (if warning a non member doesn\'t work :/)',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!staff) return msg.reply(`I'm sorry but you have to be in the staff team to use this command!`);
    if (msg.mentions.members.first()) return msg.reply('You may only insert a user ID!');
    try {
      await client.users.fetch(args[0]);
    } catch (err) {
      return msg.reply("Something went wrong, make sure to insert a user ID!");
    }
    return msg.reply(`Successfully fetched **${client.users.cache.get(args[0]).tag}**!`);
  }
}