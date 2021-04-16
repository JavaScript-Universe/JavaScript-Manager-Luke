const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'break',
  category: 'Staff',
  aliases: [],
  usage: 'request <time (no spaces: 2days)> <reason (away from home on vacation)>',
  description: 'Request a LOA',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!staff) return msg.reply("I'm sorry but you have to be a staff member to use this command!").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    if (!admin && msg.channel.id != '776382772407042078') return msg.reply("I'm sorry but you have to be in <#776382772407042078> to use this!").then(d => d.delete({ timeout: 7000 })).then(msg.delete({ timeout: 3000 }));
    const breaksDB = new Enmap({ name: 'breaks' });
    breaksDB.ensure(msg.author.id, { ID: msg.author.id, requestedAt: 'N/A', status: 'N/A', reason: 'N/A', duration: 'N/A'});
    const action = args[0];
    const requestedAt = Date.now();
    const duration = args[1];
    const reason = args.slice(2);
    const breakRole = client.guilds.cache.get('757759707674050591').roles.cache.get('776383710940758027');
    const breakQueue = client.channels.cache.get('776383187441418260');
    if (action && action == 'request') {
        if (breaksDB.get(msg.author.id).status == 'N/A') {
            if (!duration) return msg.reply("Please state for how long you will be on break (e.g 2Days)").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
            if (reason.length < 5) return msg.reply("Please state why you are going on break (e.g \"I have to learn for a test\")").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
            breaksDB.set(msg.author.id, { ID: msg.author.id, requestedAt: requestedAt, status: 'pending', reason: reason.join(' '), duration: duration });
            msg.reply("Your break request has been added to the queue, please wait for it be approved before actually going on break!").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
            const em = new MessageEmbed()
            .setTitle(`${msg.author.username}'s Break Request`)
            .addField("Duration:", duration)
            .addField("Reason:", reason.join(' '))
            .setFooter(`${msg.author.username}'s ID: ${msg.author.id}`)
            .setTimestamp();
            return breakQueue.send(em);
        } else {
           return msg.reply("You are already on break or got one pending, please end your break first or wait for it to be approved!").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
        }
    } else if (action && action == 'approve' && admin) {
        const thatRequested = args[1];
        if (!thatRequested) return msg.reply("I'd appreciate it if you'd tell me who's break you want to approve...").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
        if (!breaksDB.get(thatRequested) && breaksDB.get(thatRequested).status != 'pending') return msg.reply("The ID you submitted either is not in the database or is not pending a break approval!").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
        const oldRequestedAt = breaksDB.get(thatRequested).requestedAt;
        const oldReason = breaksDB.get(thatRequested).reason;
        const oldDuration = breaksDB.get(thatRequested).duration;
        breaksDB.set(thatRequested, { ID: thatRequested, requestedAt: oldRequestedAt, status: 'approved', reason: oldReason, duration: oldDuration });
        client.guilds.cache.get('757759707674050591').member(thatRequested).roles.add(breakRole);
        const em = new MessageEmbed()
        .setTitle(`Approved ${client.users.cache.get(thatRequested).username}'s Break Request`)
        .setColor("GREEN")
        .setTimestamp();
        breakQueue.send(em);
        const confirmEm = new MessageEmbed()
        .setTitle("Your break request has been approved!")
        .setColor("GREEN")
        .setTimestamp();
        return client.users.cache.get(thatRequested).send(confirmEm);
    } else if (action && action == 'deny' && admin) {
        const thatRequested = args[1];
        if (!thatRequested) return msg.reply("I'd appreciate it if you'd tell me who's break you want to approve...").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
        if (!breaksDB.get(thatRequested) && breaksDB.get(thatRequested).status != 'pending') return msg.reply("The ID you submitted either is not in the database or is not pending a break approval!").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
        breaksDB.set(thatRequested, { ID: thatRequested, requestedAt: 'N/A', status: 'N/A', reason: 'N/A', duration: 'N/A' });
        const em = new MessageEmbed()
        .setTitle(`Denied ${client.users.cache.get(thatRequested).username}'s Break Request`)
        .setColor("RED")
        .setTimestamp();
        breakQueue.send(em);
        const confirmEm = new MessageEmbed()
        .setTitle("Your break request has been denied!")
        .setColor("RED")
        .setTimestamp();
        return client.users.cache.get(thatRequested).send(confirmEm);
    } else if (action && action == 'end') {
        if (breaksDB.get(msg.author.id).status != 'approved') return msg.reply("You are not currently on break!").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
        breaksDB.set(msg.author.id, { ID: msg.author.id, requestedAt: 'N/A', status: 'N/A', reason: 'N/A', duration: 'N/A' });
        msg.member.roles.remove(breakRole);
        return msg.reply("I have ended your break, welcome back!").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
    } else {
        return msg.reply("That's not how you use this command, run '!help break' in the bot commands channel for some info!").then(d => d.delete({ timeout: 10000 })).then(msg.delete({ timeout: 3000 }));
    }
  }
}