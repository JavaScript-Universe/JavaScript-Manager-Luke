const Enmap = require('enmap');
const { MessageEmbed } = require('discord.js');

async function warn(msg, id, points, reason) {
    if (!msg) return false; 
    if (!id) return false;
    // if (!points) return false;
    if (!reason) return false;
    const warnsDB = new Enmap({ name: 'warns' });
    warnsDB.ensure(id, {points: 0, warns: {}});
    const toWarn = msg.client.users.cache.get(id);
    if (!toWarn) return false;
    const warnLogs = msg.client.channels.cache.get('757770065927209051');
    const warnedTotalPoints = warnsDB.get(id).points + parseInt(points);
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
    .addField("Member", `${toWarn.tag} (${id})`)
    .addField("Moderator", `Auto Mod`)
    .addField("Points", `\`${parseInt(points)}\``)
    .addField("Reason", `\`${reason}\``)
    .addField("Total Points", `\`${parseInt(warnedTotalPoints).toLocaleString()}\``)
    .addField("Other Cases", `\`${Object.keys(warnsDB.get(id).warns).length != 0 ? Object.keys(warnsDB.get(id).warns).join('\n') : 'none'}\``)
    .setFooter(`By: Auto Mod`)
    .setTimestamp();
    await warnLogs.send(em);
    const emUser = new MessageEmbed()
    .setTitle("Warned - Auto Mod")
    .setColor("ORANGE")
    .setDescription(`You were warned in **JavaScript Universe** for ${reason}, please don't do it again!`)
    .addField("Case ID", `\`${caseID}\``)
    .addField("Points", parseInt(points).toLocaleString())
    .addField("Appeal Link", "[Click Me](https://docs.google.com/forms/d/1zxH9sFrTEHgDd56Jm1B4ieDTJbYVv4JGwkhyK3cYxDY)")
    .setTimestamp();
    await toWarn.send(emUser).catch(err => err);
    const totPoints = warnsDB.get(id).points + parseInt(points);
    warnsDB.set(id, totPoints, 'points');
    warnsDB.set(id, {moderator: 'auto mod', points: parseInt(points), reason: reason}, `warns.${caseID}`);
    if (warnsDB.get(id).points == 4) {
      await msg.guild.member(id).kick(`Moderator: Auto Mod, Reason: ${reason}`)
    } else if (warnsDB.get(id).points >= 5) {
      await msg.guild.members.ban(id, { reason: `Moderator: Auto Mod, Reason: ${reason}` })
    }
    return true;
}


module.exports = {
    warn
}