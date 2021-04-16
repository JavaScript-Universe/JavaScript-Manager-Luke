const moment = require("moment");
const Enmap = require("enmap");
const { Message } = require("discord.js");
require("moment-duration-format");

module.exports = {
  name: "helper",
  category: "Utility",
  aliases: [],
  usage: "",
  description: "Gives or takes the helper role from you",
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (msg.member.roles.cache.has("720788623376646175")) {
      await msg.member.roles.remove("720788623376646175");
      msg.delete({ timeout: 1000 });
      return msg.channel
        .send(
          `${msg.member} I have successfully taken the helper role from you!`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    } else {
      await msg.member.roles.add("720788623376646175");
      msg.delete({ timeout: 1000 });
      return msg.channel
        .send(`${msg.member} I have successfully given the helper role to you!`)
        .then((m) => m.delete({ timeout: 5000 }));
    }
  },
};
