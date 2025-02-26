/* 
███    ███  █████  ██████  ███████     ██████  ██    ██     ███████  █████  ██    ██ ██████  ███████ 
████  ████ ██   ██ ██   ██ ██          ██   ██  ██  ██      ██      ██   ██  ██  ██  ██   ██    ███  
██ ████ ██ ███████ ██   ██ █████       ██████    ████       ███████ ███████   ████   ██████    ███   
██  ██  ██ ██   ██ ██   ██ ██          ██   ██    ██             ██ ██   ██    ██    ██   ██  ███    
██      ██ ██   ██ ██████  ███████     ██████     ██        ███████ ██   ██    ██    ██   ██ ███████ 

Original Repo: https://github.com/ix1g/Mc-Bot
License: MIT
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
            const response = await axios.get('https://api.mcsrvstat.us/2/46.202.82.164:1043'); // Here's the API this api have v3 you can search this API
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle('play.heatexmc.net') // PUT YOUR EMBED TITLE LIKE "Minecraft Server Status" Or what you want
                .setTimestamp(); // All right's reserved to Vex Extra

            if (data.online) {
                const playersOnline = data.players.online || 0; // All right's reserved to Vex Extra
                const playersMax = data.players.max || 0; // All right's reserved to Vex Extra

                embed
                    .addFields(
                        { name: 'Server IP', value: '`play.heatexmc.net`', inline: true }, // Please make sure you change the server IP
                        { name: 'Players', value: `\`${playersOnline}\`/\`${playersMax}\`:video_game:`, inline: true },
                        { name: 'Status', value: '`Online`', inline: true }, // Status info if it's online or not
                    )
                    .setColor('#fbab60'); // color of the online status
            } else {
                embed
                    .addFields(
                        { name: 'Status', value: '`Offline`', inline: true }, // same thing of the status info
                        { name: 'Players', value: '`0/0`', inline: true }, // players do it NONE if you want 
                        { name: 'Server IP', value: '`play.heatexmc.net`', inline: true } // Change the ip if you want
                    )
                    .setColor('#FF0000'); // color of the offline status
            }
            embed.setFooter({
                text: 'Play.heatexMc.net', // Embed Footer put your server name or what ever you want
                iconURL: 'https://media.discordapp.net/attachments/1332787349322469506/1344431335376158812/Brown_Bold_Background_Instagram_Post_1.png?ex=67c0e2c0&is=67bf9140&hm=8d6ab379101ae7121c082fd6418b599467e50baa8af40ff78be5a6904a8e831b&=&format=webp&quality=lossless&width=469&height=469'
            }); // Footer icon here change it
            embed.setImage('https://api.loohpjames.com/serverbanner.png?ip=46.202.82.164:1043'); // Image of the Embed change it to "https://api.loohpjames.com/serverbanner.png?ip=your-ip" change the your ip to like "https://api.loohpjames.com/serverbanner.png?ip=play.matrixmc.cc"
            embed.setThumbnail('https://api.mcsrvstat.us/icon/46.202.82.164:1043'); // Change the ip of this
            message.channel.send({ embeds: [embed] });
        } catch (error) { // All right's reserved to Vex Extra
            message.channel.send('فشل المحاولة يجب الاتصال بالمبرمج.'); // Error message "في حال صار خطأ كلمني SaYrZ","if something wrong happen talk to me SAYRZ"
            console.error(error); 
        }
    }
});

client.login(process.env.BOT_TOKEN); // Put it into the .env file
