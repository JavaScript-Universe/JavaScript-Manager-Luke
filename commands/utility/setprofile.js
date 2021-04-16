const moment = require("moment");
const Enmap = require("enmap");
const { Message } = require("discord.js");
const message = require("../../events/message");
require("moment-duration-format");

module.exports = {
  name: "setprofile",
  category: "Utility",
  aliases: [],
  usage:
    "<bio/knowledge/projects(Donator/Booster/Popular/Proficient only)/banner(Donator only)>",
  description: "Set up you profile",
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    db.users.ensure(msg.author.id, {
      bio: "",
      knowledge: "",
      projects: "",
      banner: "",
    });
    const canPromote = (ID) => {
      return (
        msg.guild.members.cache.get(ID).roles.cache.has("796497467850883092") || // Donator
        msg.guild.members.cache.get(ID).roles.cache.has("760300040144289843") || // Proficient
        msg.guild.members.cache.get(ID).roles.cache.has("721356288470024253") || // Server Booster
        msg.guild.members.cache.get(ID).roles.cache.has("740275973953683516")
      ); // Popualar
    };
    const isDonator = (ID) => {
      return msg.guild.members.cache
        .get(ID)
        .roles.cache.has("796497467850883092");
    };
    let type = args[0];
    const data = args.slice(1).join(" ");
    if (!type)
      return msg.reply(
        "Hey there, you should specify one of the following options: `<bio/knowledge/projects(Donator/Booster/Popular/Proficient only)/Banner(Donator only)>`"
      );
    if (!data)
      return msg
        .reply(`Hey there, you should insert what you want your ${type} to be.`)
        .then((d) => d.delete({ timeout: 8000 }))
        .then(msg.delete({ timeout: 2000 }));
    type = type.toLowerCase();
    if (type == "bio") {
      msg
        .reply("Your bio has been set up successfully!")
        .then((d) => d.delete({ timeout: 8000 }))
        .then(msg.delete({ timeout: 2000 }));
      return db.users.set(msg.author.id, data, "bio");
    } else if (type == "knowledge") {
      msg
        .reply("Your knowledge has been set up successfully!")
        .then((d) => d.delete({ timeout: 8000 }))
        .then(msg.delete({ timeout: 2000 }));
      return db.users.set(msg.author.id, data, "knowledge");
    } else if (type == "projects") {
      if (!canPromote(msg.author.id))
        return msg
          .reply(
            "Hey there, you must have one of the following roles to set your projects: Donator, Server Booster, Popular, Proficient"
          )
          .then((d) => d.delete({ timeout: 8000 }))
          .then(msg.delete({ timeout: 2000 }));
      msg
        .reply("Your projects have been set up successfully!")
        .then((d) => d.delete({ timeout: 8000 }))
        .then(msg.delete({ timeout: 2000 }));
      return db.users.set(msg.author.id, data, "projects");
    } else if (type == "banner") {
      if (!isDonator(msg.author.id))
        return msg.reply("Hey there, you must be a donator to set a banner.");
      if (
        !new RegExp(
          "^https?://(?:[a-z0-9-]+.)+[a-z]{2,6}(?:/[^/#?]+)+.(?:jpg|gif|png)$"
        ).test(data)
      )
        return msg
          .reply("Your banner link must end with: jpg, gif or png")
          .then((d) => d.delete({ timeout: 8000 }))
          .then(msg.delete({ timeout: 2000 }));
      msg
        .reply("Your banner has been set up successfully!")
        .then((d) => d.delete({ timeout: 8000 }))
        .then(msg.delete({ timeout: 2000 }));
      return db.users.set(msg.author.id, data, "banner");
    } else {
      return msg.reply(
        "Hey there, you should specify one of the following options: `<bio/knowledge/projects(Donator/Booster/Popular/Proficient only)/Banner(Donator only)>`"
      );
    }
  },
};
