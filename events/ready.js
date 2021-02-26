const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const moment = require('moment');
module.exports = async client => {
  // Log that the bot is online.
  console.log(`${client.user.tag}, ready in ${client.guilds.cache.size} servers.`, "ready");
  client.appInfo = await client.fetchApplication();

  // Fetch all client users.
  await client.guilds.cache.forEach(g => g.available && g.members.fetch());

  // Fetch all starboard messages.
  const starboard = client.channels.cache.get('778429519639347210');
  await starboard.messages.fetch()
  starboard.messages.cache.filter(m => !m.deleted && m.embeds.size > 0).forEach(async (mesg) => {
    const chanID = mesg.embeds[0].footer.text.split(' : ')[1]
    const messageID = mesg.embeds[0].footer.text.split(' : ')[0]
    await client.channels.cache.get(chanID).messages.fetch(messageID);
  })

  // Staff messages check.
  const db = new Enmap({ name: 'staffChecks' });
  const MINUTE = 60 * 1000;
  const WEEK = 7 * 24 * 60 * 60 * 1000;

  async function check(db) {
      const startDate = new Date(2020, 11, 20, 0, 0, 0, 0).getTime();
      db.ensure('last_check', startDate);
      let lastPost = db.get('last_check');
      setInterval(async () => {
          if (Date.now() - lastPost > WEEK) {
              lastPost += WEEK;
              const filter = db.filter(d => d.id && typeof d.id == 'string');
              const checkChan = client.channels.cache.get('812011010386034702');
              const em = new MessageEmbed()
              .setColor(color)
              .setTitle(`Staff Checks | ${moment(Date.now()).format('LL')}`);
              for(const data of filter) {
                em.addField(`${(await client.users.fetch(data[1].id)).tag} | ${(await client.guilds.cache.get('812011009682178089').members.fetch(data[1].id)) ? (await client.guilds.cache.get('812011009682178089').members.fetch(data[1].id)).roles.highest.name : 'N/A'}`, `${data[1].count.toLocaleString()} messages sent`);
              }
              checkChan.send(em);
              db.clear()
              db.set('last_check', lastPost);
          }
        },
      MINUTE
    )
  };
  check(db);

  // Mutes system
  setInterval(() => {
    const mutedDB = new Enmap({ name: 'mutes' })
    .forEach(async (db) => {
      if (db.duration === 0) return;
      const previous = db.mutedAt;
      let cd = (db.duration - (Date.now() - previous))
      if (previous !== null && previous !== undefined && cd > 0) return // Still muted.
      if ((db.duration - (Date.now() - previous)) >= 0) return // Still muted.
      // Unmute here.
      const server = client.guilds.cache.get('812011009682178089');
      await server.member(db.id).roles.set(db.roles);
      await server.member(db.id).send("You were unmuted in **JavaScript Universe**");
      const clearedWarnsLog = client.channels.cache.get('795937907809845248');
      const em = new MessageEmbed()
      .setTitle("Unmuted")
      .setColor("GREEN")
      .addField("Automatic Unmute", `System`)
      .addField("User", `${server.member(db.id).user.tag} (${db.id})`)
      .setTimestamp();
      await clearedWarnsLog.send(em);
      new Enmap({ name: 'mutes' }).delete(db.id)
    });
  }, 60000);

  // Make helper role mentionable again.
  setInterval(async () => {
    const map = new Enmap({ name: 'helperRole' });
    if (!map.get('lastPinged')) return;
    const previous = map.get('lastPinged');
    let cd = (1800000 - (Date.now() - previous));
    if (previous !== null && previous !== undefined && cd > 0) return // Still has to be unmentionable.
    if ((1800000 - (Date.now() - previous)) >= 0) return // Still has to be unmentionable.
    // Make mentionable again.
    const server = client.guilds.cache.get('812011009682178089');
    const role = server.roles.cache.get('720788623376646175');
    await role.edit({ mentionable: true });
    map.delete('lastPinged');
  }, 60000);
};
