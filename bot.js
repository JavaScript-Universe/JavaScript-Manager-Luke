const { Discord: Discord, Client, Collection, MessageEmbed, Message } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');


// Start of Discord Bot
const client = new Client();
client.commands = new Collection();
client.events = new Collection();
client.aliases = new Collection();
client.items = new Collection();

// Command Handler
['commandHandler'].forEach(handler => {
  require(`./handler/${handler}`)(client);
});

// Event Handler
fs.readdir('./events', (err, files) => {
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.debugg = false;
client.supportSticky = true;
client.afk = new Map();
client.antiSpam = new Map();
client.queues = new Map();

String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
color = '#FFFFF4';

client.login(process.env.TOKEN);
