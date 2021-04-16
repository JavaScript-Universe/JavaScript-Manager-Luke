const moment = require("moment");
const Enmap = require('enmap');
const { waitForDebugger } = require("inspector");
require("moment-duration-format");

module.exports = {
  name: 'ping',
  category: 'Bot',
  aliases: [],
  usage: '',
  description: 'Pongs',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const clientPing = Math.round(client.ws.ping);
    let discordPing;
    const em = new MessageEmbed()
    .setColor(color)
    .setDescription("<a:loading:766269176129126411> Retrieving data...");
    const m = await msg.channel.send(em);
    function wait(variable1, ms) {
      return setTimeout(() => {
        discordPing = variable1.createdTimestamp - msg.createdTimestamp;
        const em1 = new MessageEmbed()
        .setColor(color)
        .setTitle("Pong!")
        .addField("Client Ping", `\`${clientPing}ms\``)
        .addField("Latency", `\`${discordPing}ms\``)
        .setTimestamp();
        variable1.edit(em1);
      }, ms)
    }
    return wait(m, 1500);
  }
}