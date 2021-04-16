const { Discord, MessageEmbed } = require("discord.js");
const Enmap = require("enmap");
const { warn } = require("../handler/functions.js");

module.exports = async (client, oldMessage, newMessage) => {
  let runCommand = false;
  const msg = newMessage;
  if (!newMessage.guild) return;
  let prefix = "!";

  if (!newMessage.content) return;
  if (
    msg.author.bot ||
    (msg.guild && !msg.channel.permissionsFor(client.user).has("SEND_MESSAGES"))
  )
    return;

  moderation = client.guilds.cache
    .get("812011009682178089")
    .member(msg.member.id)
    ? client.guilds.cache
        .get("812011009682178089")
        .member(msg.member.id)
        .roles.cache.has("757768007370932254")
    : false;
  support = client.guilds.cache.get("812011009682178089").member(msg.member.id)
    ? client.guilds.cache
        .get("812011009682178089")
        .member(msg.member.id)
        .roles.cache.has("757768012618006569")
    : false;
  staff = client.guilds.cache.get("812011009682178089").member(msg.member.id)
    ? client.guilds.cache
        .get("812011009682178089")
        .member(msg.member.id)
        .roles.cache.has("757764284779593738")
    : false;
  admin = client.guilds.cache.get("812011009682178089").member(msg.member.id)
    ? client.guilds.cache
        .get("812011009682178089")
        .member(msg.member.id)
        .roles.cache.has("757762082929377281")
    : false;

  // Automod.
  if (
    /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z]/g.test(
      msg.content
    )
  ) {
    if (staff) return;
    if (msg.guild.id == "812011009682178089") return;
    if (
      msg.channel.id == "721462495595855912" /* Promotions Channel */ ||
      msg.channel.id == "720938094353711144" /* Partnerships Channel */
    )
      return;
    const invite = await client.fetchInvite(
      msg.content
        .match(
          /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z]/g
        )
        .join(" ")
        .split("/")[3] ||
        msg.content
          .match(
            /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z]/g
          )
          .join(" ")
          .split("/")[1]
    );
    if (invite.guild.id == "720661480143454340") return;
    msg.delete({ timeout: 0 });
    const alertsChannel = client.channels.cache.get("812011010977562643");
    const em = new MessageEmbed()
      .setColor("RED")
      .setDescription(
        "Hey! That's not allowed here! Do not try to send invites to another server!"
      );
    msg.channel
      .send(msg.member.toString(), em)
      .then((m) => m.delete({ timeout: 8000 }));
    const em1 = new MessageEmbed()
      .setTitle("Auto Mod")
      .setDescription(
        "Someone tried to send an invite to another server, they have been warned!"
      )
      .setColor("ORANGE")
      .addField("Channel:", msg.channel.toString())
      .addField("User:", msg.author.tag)
      .addField("Nickname:", msg.member.displayName)
      .addField(
        "Invite Link:",
        msg.content
          .match(
            /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z]/g
          )
          .join(" ")
      )
      .setFooter(`User ID: ${msg.author.id}`);
    alertsChannel.send(em1);
  }

  // Anti swear filter
  const arr = db.badWords.keyArray();
  const str = msg.content.toLowerCase();
  value = false;
  for (i = 0; i < arr.length; i++) {
    const reg = new RegExp(`\\b${arr[i]}\\b`, "gi");
    if (str.search(reg) !== -1) {
      if (value == true) return;
      if (msg.guild.id == "812011009682178089") return;
      if (!admin) {
        msg.delete({ timeout: 0 });
        const alertsChannel = client.channels.cache.get("812011010977562643");
        const em = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            "Hey! This is a family friendly server, do not try to say bad words!"
          );
        msg.channel
          .send(msg.member.toString(), em)
          .then((m) => m.delete({ timeout: 8000 }));
        const em1 = new MessageEmbed()
          .setTitle("Auto Mod")
          .setDescription(
            "Someone tried to say a bad word, they have been warned!"
          )
          .setColor("ORANGE")
          .addField("Channel:", msg.channel.toString())
          .addField("User:", msg.author.tag)
          .addField("Nickname:", msg.member.displayName)
          .addField("Message:", msg.content)
          .addField("Bad Word:", arr[i])
          .setFooter(`User ID: ${msg.author.id}`);
        alertsChannel.send(em1);
        value = true;
      }
    }
  }

  let prefixLength = prefix.length;

  const args = msg.content.slice(prefixLength).trim().split(/ +/g);
  const cmdName = args.shift().toLowerCase();
  let command =
    client.commands.get(cmdName) ||
    client.commands.get(client.aliases.get(cmdName));

  if (!runCommand) if (!msg.content.startsWith(prefix)) return; // Checks if message starts with server prefix.
  if (!command) {
    if (new Enmap({ name: "infos" }).has(cmdName)) {
      const info = new Enmap({ name: "infos" }).get(cmdName);
      const em = new MessageEmbed()
        .setTitle(cmdName.toProperCase())
        .setColor(color)
        .setDescription(info.replace(/\\n/g, "\n"))
        .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`)
        .setTimestamp();
      return msg.channel.send(em);
    }
    return;
  }

  msg.guild.boost = function boost(number) {
    return true;
  };

  let server = msg.guild;
  return command.run(
    client,
    msg,
    args,
    prefix,
    command,
    Discord,
    MessageEmbed,
    server
  );
};
