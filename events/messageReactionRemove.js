const { Discord, MessageEmbed } = require('discord.js');
const { warn } = require('../handler/functions.js');

module.exports = async (client, messageReaction) => {
    if (messageReaction.message.author.bot) return;
    if (messageReaction.emoji.name != '⭐') return;
    if (messageReaction.count < 5) {
        const starboard = client.channels.cache.get('778429519639347210');
        await starboard.messages.fetch()
        const matchingContent = starboard.messages.cache.find(m => m.embeds[0].footer.text.split(' : ')[0] == messageReaction.message.id) || false;
        if (!matchingContent) return; // No matching starboard message was found, no need to edit.
        // Delete matching starboard message.
        return matchingContent.delete({ timeout: 1000 });
    } else {
        const starboard = client.channels.cache.get('778429519639347210');
        await starboard.messages.fetch()
        const matchingContent = starboard.messages.cache.find(m => m.embeds[0].footer.text.split(' : ')[0] == messageReaction.message.id) || false;
        if (!matchingContent) { // Create starboard message here.
            const em = new MessageEmbed()
            .setAuthor(messageReaction.message.author.username, messageReaction.message.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setColor("YELLOW");
            if (messageReaction.message.content) {
                em.setDescription(messageReaction.message.content)
            }
            em.addField(`Stars [${messageReaction.count}]`, '⭐'.repeat(messageReaction.count))
            em.addField("Link to message", `[Click Me](https://discord.com/channels/720661480143454340/${messageReaction.message.channel.id}/${messageReaction.message.id})`)
            if (messageReaction.message.attachments.size > 0) {
                em.setImage(messageReaction.message.attachments.first().url)
            }
            em.setFooter(`${messageReaction.message.id} : ${messageReaction.message.channel.id}`);
            return starboard.send(em);
        }
        // Edit starboard message with new stars.
        const em = new MessageEmbed()
        .setAuthor(messageReaction.message.author.username, messageReaction.message.author.displayAvatarURL({ format: 'png', dynamic: true }))
        .setColor("YELLOW");
        if (messageReaction.message.content) {
            em.setDescription(messageReaction.message.content)
        }
        em.addField(`Stars [${messageReaction.count}]`, '⭐'.repeat(messageReaction.count))
        em.addField("Link to message", `[Click Me](https://discord.com/channels/720661480143454340/${messageReaction.message.channel.id}/${messageReaction.message.id})`)
        if (messageReaction.message.attachments.size > 0) {
            em.setImage(messageReaction.message.attachments.first().url)
        }
        em.setFooter(`${messageReaction.message.id} : ${messageReaction.message.channel.id}`);
        return matchingContent.edit(em);
    }

}