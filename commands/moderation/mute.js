const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'mute',
  category: 'Moderation',
  aliases: [],
  usage: '<User ID/@mention> <duration (seconds)> <reason>',
  description: 'Mute a member',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const warnsDB = new Enmap({ name: 'warns' });
    const mutedDB = new Enmap({ name: 'mutes' });
    const cannedMsgs = new Enmap({ name: 'cannedMsgs' });
    const server = client.guilds.cache.get('757759707674050591');
    if (!moderation) return msg.reply('You have to be with the moderation team to be able to use this command!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    const toWarn = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
    const moderator = msg.member;
    if (!toWarn) return msg.reply('Please insert a member to mute!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    warnsDB.ensure(toWarn.id, {warns: {}});
    mutedDB.ensure(toWarn.id, {roles: [], duration: 0, mutedAt: 0, id: 0});
    let duration = args[1];
    if (!duration) return msg.reply('Please insert the duration you want to mute this member for (insert 0 for perm)!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    if (!/^\d+$/.test(duration)) return msg.reply('Please insert the duration you want to mute this member for (insert 0 for perm)!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    let reason = args.join(' ').replace(args[0], '').replace(args[1], '').trim();
    if (!reason) return msg.reply('Please insert the reason you want to mute this member for!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    if (moderator.id == toWarn.id) return msg.reply("You may not mute yourself dumby!")
    if (server.member(moderator.id).roles.highest.rawPosition <= (server.member(toWarn.id) ? server.member(toWarn.id).roles.highest.rawPosition : 0)) return msg.reply('You may not mute someone with the same rank or a rank higher as yourself!').then(d => d.delete({ timeout: 5000 })).then(msg.delete({ timeout: 2000 }));
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
    mutedDB.set(toWarn.id, {roles: (msg.guild.member(toWarn.id).roles.cache.array().filter(r => r.id != '720661480143454340' && r.id != '757759707674050591').map(r => r.id)), duration: (duration * 1000), mutedAt: Date.now(), id: toWarn.id});
    const caseID = makeid(10);
    const em = new MessageEmbed()
    .setTitle(`Case - ${caseID}`)
    .setColor("ORANGE")
    .addField("Member", `${toWarn.tag} (${toWarn.id})`)
    .addField("Moderator", `${moderator.user.tag} (${moderator.id})`)
    .addField("Reason", `\`(muted) - ${reason}\``)
    .addField("Duration", moment.duration(duration, "seconds").format('d [days], h [hours], m [minutes] [and] s [seconds]'))
    .setFooter(`By: ${moderator.user.tag} (${moderator.id})`)
    .setTimestamp();
    await warnLogs.send(em);
    const emUser = new MessageEmbed()
    .setTitle("Muted")
    .setColor("ORANGE")
    .setDescription(`You were muted in **JavaScript Universe** for ${reason}, please don't do it again!`)
    .addField("Duration", moment.duration(duration, "seconds").format('d [days], h [hours], m [minutes] [and] s [seconds]'))
    .addField("Case ID", `\`${caseID}\``)
    .setTimestamp();
    await toWarn.send(emUser).catch(err => err);
    const emChan = new MessageEmbed()
    .setDescription(`You have succesfully muted **${toWarn.tag}**.`)
    .setColor("ORANGE")
    .setTimestamp();
    await msg.channel.send(emChan).then(d => d.delete({ timeout: 6000 })).then(msg.delete({ timeout: 2000 }));
    warnsDB.set(toWarn.id, {moderator: moderator.id, reason: `(muted) - ${reason}`, date: moment(Date.now()).format('LL')}, `warns.${caseID}`);
    return msg.guild.member(toWarn.id).roles.set(['795934921717710879']);
  }
}