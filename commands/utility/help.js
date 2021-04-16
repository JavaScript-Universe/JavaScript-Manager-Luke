const moment = require('moment');

module.exports = {
  name: 'help',
  category: 'Utility',
  description: 'The help menu',
  usage: '<category/command>',
  aliases: ['h'],
  permLevel: '0',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed, userLevel) => {
    const cat = args.join(' ');

    // Filter out commands if user cannot use them or if user cannot use that cmd in DMs.
    const myCommands = client.commands;
    const CommandNames = myCommands.keyArray();

    const embed = new MessageEmbed().setColor(color).setFooter(msg.author.username, msg.author.avatarURL()); // Create embed so you dont create it 9000 times.

    let query = args[0]; // Has to be args[0] cuz we dont have two word commands/categories
    if (query) {
      const commands = [];

      CommandNames.forEach((cmd) => {
        const command = myCommands.get(cmd);
        if (command.category.toLowerCase() === cat.toLowerCase()) {
          commands.push(command);
        }
      });

      const output = [];
      commands.forEach((cmd) => { // Fetch all commands and descriptions.
        output.push(`\`${prefix}${cmd.name}\` - ${cmd.description || "Not specified"}`);
      });

      if (commands.length <= 0) {
        try {
          let command = query;
          if (client.commands.has(command) || client.aliases.has(command)) {
            command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
            embed.setTitle(`Help » ${command.name}`)
            embed.addField(`» Description`, command.description || "None");
            embed.addField(`» Usage`, `${prefix}${command.name} ${command.usage ? command.usage : ""}` || "None");
            embed.addField(`» Cooldown`, command.cooldown ? moment.duration(command.cooldown).format("D [days], H [hrs], m [mins] [and] s [secs]") : "None");
            embed.addField(`» Aliases`, command.aliases ? command.aliases.join(', ') : "None");
            msg.channel.send(embed);
          } else { // Command doesnt exist in either aliases or commands.
            embed.setTitle('Something went wrong!')
            embed.setColor('RED')
            embed.setDescription(`It seems **${query}** is not a valid category, or a command name`);
            msg.channel.send(embed);
          }
        } catch (_) { // Catch Errors...
          embed.setTitle('Something went wrong!')
          embed.setColor('RED')
          embed.setDescription(`It seems **${query}** is not a valid category, or a command name`);
          msg.channel.send(embed);
        }
      } else { // Categories
        let premcategories = ['music'];
        if (premcategories.includes(query.toLowerCase()) && !settings(msg.guild.id).premium.enabled) {
          embed.setTitle(`Help » ${query}`)
          embed.setDescription(`Please purchase premium on [patreon](https://www.patreon.com/GCAPremium)`);
          msg.channel.send(embed);
          // to check for premium => settings(msg.guild.id).premium.enabled (either true or false for output)
        } else {
          embed.setTitle(`Help » ${query}`)
          embed.setDescription(`${output.join('\n')}`);
          msg.channel.send(embed);
        }
      }
    }

    if (!query) { // No category/command specified.
      const myCategories = [];

      CommandNames.forEach((cmd) => {
        const category = myCommands.get(cmd).category;
        if (!myCategories.includes(`${category}`)) {
          myCategories.push(`${category}`);
        }
      });
      embed.setTitle('Help')
        .setDescription(`Please select a category to see its available commands.\nUsage: \`${prefix}help <command/category>\``)
        .addField('» Available Categories', myCategories.join('\n').toProperCase(), true)
        .addField('» Useful Information', "[Server Invite](https://discord.gg/javascript)\n[Server Rules](https://discordapp.com/channels/720661480143454340/720719184543088691/720719325723361362)\n[Warning Appeal](https://docs.google.com/forms/d/1zxH9sFrTEHgDd56Jm1B4ieDTJbYVv4JGwkhyK3cYxDY)\n[Support Application](https://docs.google.com/forms/d/1k2AvZEnwbL7TFPuFduRCODBgMp8bT4YWQM4cEgIx-mw)", true)
      msg.channel.send(embed);
    }
  }
}