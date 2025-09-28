/* 
███    ███  █████  ██████  ███████     ██████  ██    ██     ███████  █████  ██    ██ ██████  ███████ 
████  ████ ██   ██ ██   ██ ██          ██   ██  ██  ██      ██      ██   ██  ██  ██  ██   ██    ███  
██ ████ ██ ███████ ██   ██ █████       ██████    ████       ███████ ███████   ████   ██████    ███   
██  ██  ██ ██   ██ ██   ██ ██          ██   ██    ██             ██ ██   ██    ██    ██   ██  ███    
██      ██ ██   ██ ██████  ███████     ██████     ██        ███████ ██   ██    ██    ██   ██ ███████ 

Original Repo: https://github.com/ix1g/Mc-Bot
License: MIT
Hosted On: https://rrhosting.eu
*/

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// === CONFIG (change server IP/port only here) ===
const SERVER_IP = "play.heatexmc.net";
const SERVER_PORT = 25565; // default Minecraft port

client.once('clientReady', () => {
    console.log(`✅ Bot logged in as: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === 'mc') {
        try {
            const response = await axios.get(`https://api.mcsrvstat.us/3/${SERVER_IP}:${SERVER_PORT}`);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`🌍 ${SERVER_IP}`)
                .setTimestamp();

            if (data.online) {
                const playersOnline = data.players?.online || 0;
                const playersMax = data.players?.max || 0;

                embed.addFields(
                    { name: '<:2513h:1344455101497999443> Server IP', value: `\`${SERVER_IP}\``, inline: true },
                    { name: '<:2011t:1344455097291247656> Players', value: `\`${playersOnline}\`/\`${playersMax}\` 🎮`, inline: true },
                    { name: '<:1489x:1420728830644977785> Status', value: '<:vmc_Online:1344810815970349056> Online', inline: true },
                ).setColor('#4CAF50'); // green for online
            } else {
                embed.addFields(
                    { name: '<:2513h:1344455101497999443> Status', value: '<:vmc_Offline:1344810818231079014> Offline', inline: true },
                    { name: '<:2011t:1344455097291247656> Players', value: '`0/0`', inline: true },
                    { name: '<:1489x:1420728830644977785> Server IP', value: `\`${SERVER_IP}\``, inline: true }
                ).setColor('#FF0000'); // red for offline
            }

            embed.setFooter({
                text: `${SERVER_IP}`,
                iconURL: 'https://media.discordapp.net/attachments/1332787349322469506/1344431335376158812/Brown_Bold_Background_Instagram_Post_1.png'
            });

            // Server banner + icon
            embed.setImage(`https://api.mcstatus.io/v2/widget/java/play.heatexmc.net?dark=true&rounded=true`);
            embed.setThumbnail(`https://api.mcsrvstat.us/icon/${SERVER_IP}:${SERVER_PORT}`);

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.channel.send('⚠️ Failed to fetch server status. Contact SaYrZ.');
        }
    }
});

client.login(process.env.BOT_TOKEN);

