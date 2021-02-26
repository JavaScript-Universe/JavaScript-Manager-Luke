const moment = require("moment");
const Enmap = require('enmap');
const { Message } = require("discord.js");
const message = require("../../events/message");
require("moment-duration-format");

module.exports = {
  name: 'profile',
  category: 'Utility',
  aliases: [],
  usage: '<(optional) ID/@mention>',
  description: 'Profile',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member;
    db.users.ensure(member.id, {
      bio: '',
      knowledge: '',
      projects: '',
      banner: ''
    })
    const canPromote = (ID) => {
      return msg.guild.members.cache.get(ID).roles.cache.has('796497467850883092') || // Donator
      msg.guild.members.cache.get(ID).roles.cache.has('760300040144289843') || // Proficient
      msg.guild.members.cache.get(ID).roles.cache.has('721356288470024253') || // Server Booster
      msg.guild.members.cache.get(ID).roles.cache.has('740275973953683516'); // Popualar
    };
    const isDonator = (ID) => {
      return msg.guild.members.cache.get(ID).roles.cache.has('796497467850883092');
    };
    if (member.id == msg.author.id) {
      const em = new MessageEmbed()
      .setAuthor(`${msg.author.username}'s profile`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setThumbnail(msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setColor(msg.member.roles.highest.hexColor);
      if (staff) {
        em.addField("**• Rank**", (await client.guilds.cache.get('812011009682178089').members.fetch(msg.author.id)) ? (await client.guilds.cache.get('812011009682178089').members.fetch(msg.author.id)).roles.highest.name : 'N/A');
        em.addField("**• (Week) Messages Count (aprox.)**", db.staffChecks.get(msg.author.id).count.toLocaleString());
      }
      em.addField("**• JavaScript Knowledge**", db.users.get(msg.author.id).knowledge || "None");
      em.addField("**• Biography**", db.users.get(msg.author.id).bio || "No bio set up yet");
      if (canPromote(msg.author.id)) {
        em.addField("**• Projects**", db.users.get(msg.author.id).projects || "None");
      }
      if (isDonator(msg.author.id) && db.users.get(msg.author.id).banner) {
        em.setImage(db.users.get(msg.author.id).banner)
      }
      em.setTimestamp();
      msg.channel.send(em);
    } else {
      const em = new MessageEmbed()
      .setAuthor(`${member.user.username}'s profile`, member.user.displayAvatarURL({ format: 'png', dynamic: true }))
      .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
      .setColor(member.roles.highest.hexColor);
      if (client.guilds.cache.get('812011009682178089').members.cache.get(member.id) ? client.guilds.cache.get('812011009682178089').members.cache.get(member.id).roles.cache.has('812011009682178091') : false) {
        em.addField("**• Rank**", (await client.guilds.cache.get('812011009682178089').members.fetch(member.id)) ? (await client.guilds.cache.get('812011009682178089').members.fetch(member.id)).roles.highest.name : 'N/A');
        em.addField("**• (Week) Messages Count (aprox.)**", db.staffChecks.get(member.id).count.toLocaleString());
      }
      em.addField("**• JavaScript Knowledge**", db.users.get(member.id).knowledge || "None");
      em.addField("**• Biography**", db.users.get(member.id).bio || "No bio set up yet");
      if (canPromote(member.id)) {
        em.addField("**• Projects**", db.users.get(member.id).projects || "None");
      }
      if (isDonator(member.id) && db.users.get(member.id).banner) {
        em.setImage(db.users.get(member.id).banner)
      }
      em.setTimestamp();
      msg.channel.send(em);
    }
  }
}