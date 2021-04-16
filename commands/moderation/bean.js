const moment = require("moment");
const Enmap = require("enmap");
require("moment-duration-format");

module.exports = {
  name: "bean",
  category: "Moderation",
  aliases: [],
  usage: "<User ID/@mention> <reason>",
  description: "Bean a member",
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const warnsDB = new Enmap({ name: "warns" });
    const cannedMsgs = new Enmap({ name: "cannedMsgs" });
    const server = client.guilds.cache.get("757759707674050591");
    if (!moderation)
      return msg
        .reply(
          "You have to be with the moderation team to be able to use this command!"
        )
        .then((d) => d.delete({ timeout: 5000 }))
        .then(msg.delete({ timeout: 2000 }));
    if (!msg.mentions.members && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]);
    }
    const toWarn =
      msg.mentions.users.first() || client.users.cache.get(args[0]);
    const moderator = msg.member;
    if (!toWarn)
      return msg
        .reply("Please insert a user to bean!")
        .then((d) => d.delete({ timeout: 5000 }))
        .then(msg.delete({ timeout: 2000 }));
    warnsDB.ensure(toWarn.id, { warns: {} });
    let reason = args.join(" ").replace(args[0], "").trim();
    if (!reason)
      return msg
        .reply("Please insert the reason you want to bean this user for!")
        .then((d) => d.delete({ timeout: 5000 }))
        .then(msg.delete({ timeout: 2000 }));
    if (cannedMsgs.has(reason)) reason = cannedMsgs.get(reason);
    const warnLogs = server.channels.cache.get("757770065927209051");
    function makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    const caseID = makeid(10);
    const emUser = new MessageEmbed()
      .setTitle("Beaned")
      .setColor("ORANGE")
      .setDescription(
        `You were beaned from **JavaScript Universe** for ${reason}!`
      )
      .addField("Case ID", `\`${caseID}\``)
      .addField(
        "Bean Appeal Link",
        "[Click Me](https://docs.google.com/forms/d/1zxH9sFrTEHgDd56Jm1B4ieDTJbYVv4JGwkhyK3cYxDY)"
      )
      .setTimestamp();
    await toWarn.send(emUser).catch((err) => err);
    const emChan = new MessageEmbed()
      .setDescription(`You have succesfully beaned **${toWarn.tag}**.`)
      .setColor("ORANGE")
      .setTimestamp();
    return await msg.channel
      .send(emChan)
      .then((d) => d.delete({ timeout: 6000 }))
      .then(msg.delete({ timeout: 0 }));
  },
};
