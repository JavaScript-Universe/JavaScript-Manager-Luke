const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'warn',
  category: 'Moderation',
  aliases: [],
  usage: '<User ID/@mention> <reason>',
  description: 'Warn a member',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const warnsDB = new Enmap({ name: 'warns' });
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
    const server = client.guilds.cache.get('757759707674050591');
    if (!moderation) return msg.reply('You have to be with the moderation team to be able to use this command!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    if (!msg.mentions.members && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]);
    }
    const toWarn = msg.mentions.users.first() || client.users.cache.get(args[0]);
    const moderator = msg.member;
    if (!toWarn) return msg.reply('Please insert a member to warn!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    warnsDB.ensure(toWarn.id, {warns: {}});
    let reason = args.join(' ').replace(args[0], '').trim();
    if (!reason) return msg.reply('Please insert the reason you want to warn this member for!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    if (moderator.id == toWarn.id) return msg.reply("You may not warn yourself dumby!")
    if (server.member(moderator.id).roles.highest.rawPosition <= (server.member(toWarn.id) ? server.member(toWarn.id).roles.highest.rawPosition : 0)) return msg.reply('You may not warn someone with the same rank or a rank higher as yourself!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    const warnLogs = server.channels.cache.get('757770065927209051');
    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }
    const caseID = makeid(10);
    const em = new MessageEmbed()
    .setTitle(`Case - ${caseID}`)
    .setColor("ORANGE")
    .addField("Member", `${toWarn.tag} (${toWarn.id})`)
    .addField("Moderator", `${moderator.user.tag} (${moderator.id})`)
    .addField("Reason", `\`(warned) - ${reason}\``)
    .setFooter(`By: ${moderator.user.tag} (${moderator.id})`)
    .setTimestamp();
    await warnLogs.send(em);
    const emUser = new MessageEmbed()
    .setTitle("Warned")
    .setColor("ORANGE")
    .setDescription(`You were warned in **JavaScript Universe** for ${reason}, please don't do it again!`)
    .addField("Case ID", `\`${caseID}\``)
    .setTimestamp();
    await toWarn.send(emUser).catch(err => err);
    const emChan = new MessageEmbed()
    .setDescription(`You have succesfully warned **${toWarn.tag}**.`)
    .setColor("ORANGE")
    .setTimestamp();
    await msg.channel.send(emChan).then(d => d.delete({ timeout: 6000 })).then(msg.delete({ timeout: 2000 }));
    warnsDB.set(toWarn.id, {moderator: moderator.id, reason: `(warned) - ${reason}`, date: moment(Date.now()).format('LL')}, `warns.${caseID}`);
    return;
  }
}