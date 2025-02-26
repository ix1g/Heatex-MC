/* 
███    ███  █████  ██████  ███████     ██████  ██    ██     ███████  █████  ██    ██ ██████  ███████ 
████  ████ ██   ██ ██   ██ ██          ██   ██  ██  ██      ██      ██   ██  ██  ██  ██   ██    ███  
██ ████ ██ ███████ ██   ██ █████       ██████    ████       ███████ ███████   ████   ██████    ███   
██  ██  ██ ██   ██ ██   ██ ██          ██   ██    ██             ██ ██   ██    ██    ██   ██  ███    
██      ██ ██   ██ ██████  ███████     ██████     ██        ███████ ██   ██    ██    ██   ██ ███████ 

Original Repo: https://github.com/ix1g/Mc-Bot
License: MIT
Read: https://github.com/ix1g/heatex/blob/main/README.md

*/ 

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Bot logges as: ${client.user.tag}`); // All right's reserved to Vex Extra
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // All right's reserved to Vex Extra

    if (message.content.toLowerCase() === 'mc') {
        try {
            const response = await axios.get('https://api.mcsrvstat.us/2/vexmc.xyz'); // Here's the API this api have v3 you can search this API
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle('play.vexmc.xyz') // PUT YOUR EMBED TITLE LIKE "Minecraft Server Status" Or what you want
                .setTimestamp(); // All right's reserved to Vex Extra

            if (data.online) {
                const playersOnline = data.players.online || 0; // All right's reserved to Vex Extra
                const playersMax = data.players.max || 0; // All right's reserved to Vex Extra

                embed
                    .addFields(
                        { name: 'Server IP', value: '`play.vexmc.xyz:25599`', inline: true }, // Please make sure you change the server IP
                        { name: 'Players', value: `\`${playersOnline}\`/\`${playersMax}\`:video_game:`, inline: true },
                        { name: 'Status', value: '`Online`', inline: true }, // Status info if it's online or not
                    )
                    .setColor('#00FF00'); // color of the online status
            } else {
                embed
                    .addFields(
                        { name: 'Status', value: '`Offline`', inline: true }, // same thing of the status info
                        { name: 'Players', value: '`0/0`', inline: true }, // players do it NONE if you want 
                        { name: 'Server IP', value: '`play.vexmc.xyz`', inline: true } // Change the ip if you want
                    )
                    .setColor('#FF0000'); // color of the offline status
            }
            embed.setFooter({
                text: 'Server Ip here', // Embed Footer put your server name or what ever you want
                iconURL: 'https://images-ext-1.discordapp.net/external/QyJx7ViqrOuGSvhkck_jHe4r6C8_X8ZQn-0VEd-dd00/%3Fsize%3D1024/https/cdn.discordapp.com/icons/1192877033856970844/a_cb3b3728c421f99bef1415f4f67d9e06.gif'
            }); // Footer icon here change it
            embed.setImage('https://api.loohpjames.com/serverbanner.png?ip=vexmc.xyz'); // Image of the Embed change it to "https://api.loohpjames.com/serverbanner.png?ip=your-ip" change the your ip to like "https://api.loohpjames.com/serverbanner.png?ip=play.matrixmc.cc"
            embed.setThumbnail('https://api.mcsrvstat.us/icon/vexmc.xyz'); // Change the ip of this
            message.channel.send({ embeds: [embed] });
        } catch (error) { // All right's reserved to Vex Extra
            message.channel.send('فشل المحاولة يجب الاتصال بالمبرمج.'); // Error message "في حال صار خطأ كلمني SaYrZ","if something wrong happen talk to me SAYRZ"
            console.error(error); 
        }
    }
});

client.login(process.env.BOT_TOKEN); // Put it into the .env file