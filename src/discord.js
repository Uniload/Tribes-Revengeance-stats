const Discord = require('discord.js');
const Events = require("./events.js");


const webhookId = process.env.DISCORD_WEBHOOK_ID;
const webhookToken = process.env.DISCORD_WEBHOOK_TOKEN;

const token = process.env.DISCORD_TOKEN;

const channelId = process.env.DISCORD_CHANNEL_ID || '375031503710846976';
const serverId = process.env.DISCORD_SERVER_ID || '45.32.157.166:8777';

if (webhookId && webhookToken) {
    const hook = new Discord.WebhookClient(webhookId, webhookToken);

    // Send a message using the webhook
    setTimeout(() => {
        Events.filter(x => x.type == "chat-message").subscribe(e => {
            console.log(e);
            if (e.data && e.data.user && e.data.messageFriendly) {
                hook.send(e.data.messageFriendly, { username: e.data.user });
            }
        });
    }, 10 * 1000);
}

if (token) {
    const client = new Discord.Client();
    client.login(token);

    client.on('message', message => {
        if (message.channel.id === channelId && !message.author.bot) {
            Events.next({type: "say", data: {server: serverId, usr: message.author.username, message: message.content}})
        }
    });
}
