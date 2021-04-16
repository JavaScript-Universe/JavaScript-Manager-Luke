const { Discord: Discord, Client, Collection, MessageEmbed, Message } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');


// Start of Discord Bot
const client = new Client();
client.commands = new Collection();
client.events = new Collection();
client.aliases = new Collection();

globalThis.db = {}
globalThis.db.warns = new Enmap({ name: 'warns' });
globalThis.db.users = new Enmap({ name: 'users' });
globalThis.db.infos = new Enmap({ name: 'infos' });
globalThis.db.canned = new Enmap({ name: 'cannedMsgs' });
globalThis.db.mutes = new Enmap({ name: 'mutes' });
globalThis.db.badWords = new Enmap({ name: 'badWords' });
globalThis.db.staffChecks = new Enmap({ name: 'staffChecks' });

setInterval(function () {
  globalThis.db = {}
  globalThis.db.warns = new Enmap({ name: 'warns' });
  globalThis.db.infos = new Enmap({ name: 'infos' });
  globalThis.db.users = new Enmap({ name: 'users' });
  globalThis.db.canned = new Enmap({ name: 'cannedMsgs' });
  globalThis.db.mutes = new Enmap({ name: 'mutes' });
  globalThis.db.badWords = new Enmap({ name: 'badWords' });
  globalThis.db.staffChecks = new Enmap({ name: 'staffChecks' });
}, 2000);

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

client.login('Your Token Here');
