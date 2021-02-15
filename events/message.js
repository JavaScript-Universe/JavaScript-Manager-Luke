const { Discord, MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const { warn } = require('../handler/functions.js');

module.exports = async (client, message) => {
    const msg = message;
    if (!msg.guild) return; 
    let prefix = '!'
    
    if (msg.author.bot || (message.guild && !message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) || !msg.content) return;

    moderation = client.guilds.cache.get('757759707674050591').members.cache.get(message.member.id) ? client.guilds.cache.get('757759707674050591').members.cache.get(message.member.id).roles.cache.has('757768007370932254') : false;
    support = client.guilds.cache.get('757759707674050591').members.cache.get(message.member.id) ? client.guilds.cache.get('757759707674050591').members.cache.get(message.member.id).roles.cache.has('757768012618006569') : false;
    staff = client.guilds.cache.get('757759707674050591').members.cache.get(message.member.id) ? client.guilds.cache.get('757759707674050591').members.cache.get(message.member.id).roles.cache.has('757764284779593738') : false;
    admin = client.guilds.cache.get('757759707674050591').members.cache.get(message.member.id) ? client.guilds.cache.get('757759707674050591').members.cache.get(message.member.id).roles.cache.has('757762082929377281') : false; 

    // Staff messages counter.
    if (client.guilds.cache.get('757759707674050591').members.cache.some(m => m.id == msg.author.id)) {
        const db = new Enmap({ name: 'staffChecks' });
        db.ensure(msg.author.id, {id: msg.author.id, count: 1});
        let count = db.get(msg.author.id).count;
        count += 1;
        db.set(msg.author.id, count, 'count');
    }

    // Auto dementionable helper.
    if (message.mentions.roles.has('720788623376646175')) {
        const role = client.guilds.cache.get('720661480143454340').roles.cache.get('720788623376646175');
        const map = new Enmap({ name: 'helperRole' });
        map.set('lastPinged', Date.now());
        await role.edit({ mentionable: false });
    }

    // Automod.
    if (/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z]/g.test(msg.content)) {
        if (staff) return;
        if (['721462495595855912' /* Promotions Channel */, '720938094353711144' /* Partnerships Channel */].includes(msg.channel.id)) return;
        const invite = await client.fetchInvite((msg.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z]/g).join(' ').split('/')[3] || msg.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z]/g).join(' ').split('/')[1]));
        if (invite.guild.id == '720661480143454340') return;
        msg.delete();
        const alertsChannel = client.channels.cache.get('780897877189722123');
        const em = new MessageEmbed()
        .setColor("RED")
        .setDescription("Hey! That's not allowed here! Do not try to send invites to another server!");
        msg.channel.send(msg.member.toString(), em).then(m => setTimeout(() => m.delete(), 8000));
        const em1 = new MessageEmbed()
        .setTitle("Auto Mod")
        .setDescription("Someone tried to send an invite to another server, they have been warned!")
        .setColor("ORANGE")
        .addField("Channel:", msg.channel.toString())
        .addField("User:", msg.author.tag)
        .addField("Nickname:", msg.member.displayName)
        .addField("Invite Link:", msg.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite|dsc\.gg)\/.+[a-zA-Z]/g).join(' '))
        .setFooter(`User ID: ${msg.author.id}`);
        alertsChannel.send(em1);
    }

    let prefixLength = prefix.length;

    const args = msg.content.slice(prefixLength).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();
    let command = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName));

    if (!msg.content.startsWith(prefix)) return; // Checks if message starts with server prefix.
    if (!command) {
        const infosEnmap = new Enmap({ name: 'infos' })
        if (infosEnmap.has(cmdName)) {
            const info = infosEnmap.get(cmdName);
            const em = new MessageEmbed()
            .setTitle(cmdName.toProperCase())
            .setColor(color)
            .setDescription(info.replace(/\\n/g, '\n'))
            .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`)
            .setTimestamp();
            return msg.channel.send(em);
        }
        return;
    }
    
    message.guild.boost = function boost(number) {
        return true;
    }

    let server = msg.guild;
    return command.run(client, msg, args, prefix, command, Discord, MessageEmbed, server);
}
