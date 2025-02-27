const axios = require('axios');
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

let statusMessageId = null;

const servers = {
    'HeatexMc Lobby': '', // 1st Ip
    'HeatexMc RedPvP': '', // 2nd Ip
    'Main Server': '' // 3rd Ip
};

async function getMinecraftServerStatus(ip) {
    try {
        const response = await axios.get(`https://api.mcsrvstat.us/3/${ip}`); // Api Request
        const { online, players, version } = response.data;

        let playerList = players.list ? players.list.join(', ') : 'No players online'; // This will show the list of players online

        const nextUpdateTime = Math.floor((Date.now() + 5 * 60 * 1000) / 1000); // Update the status every 5 minutes

        const statusEmbed = new EmbedBuilder()
            .setTitle(`Play.HeatexMC.net Server Status`)
            .setColor(0xfbab60) // you can change it to hex color code
            .addFields(
                { name: 'Server Online:', value: online ? '<:1372op:1344456469566980260><:59148en:1344456653893926912><:14539ed:1344456515662119043>' : '<:47485cl:1344456549703090337><:34644ose:1344456530166026284><:29516ed:1344456523597742180>', inline: true },
                { name: 'Players Online:', value: `${players.online}/${players.max}`, inline: true },
                { name: 'Player List:', value: playerList || 'None', inline: false },
                { name: 'Version:', value: version || 'Unknown', inline: true },
                { name: 'Next Update:', value: `<t:${nextUpdateTime}:R>`, inline: false }
            )
            .setTimestamp();
        return statusEmbed;
    } catch (error) {
        console.error('Error fetching server status:', error.message || error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('Server Status Error')
            .setColor(0xFF0000) // Red Color
            .setDescription('Could not fetch server status. Please try again later.')
            .setTimestamp();
        return errorEmbed;
    }
}

async function sendOrUpdateStatusMessage(channelId) {
    try {
        const mainServerEmbed = await getMinecraftServerStatus(servers['Main Server']);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('lobby')
                    .setLabel('HeatexMc Lobby')
                    .setEmoji('1304862882382610555')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('redpvp')
                    .setLabel('HeatexMc RedPvP')
                    .setEmoji('1009584972350378126')
                    .setStyle(ButtonStyle.Secondary)
            );

        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            console.error('Error: Channel not found');
            return;
        }

        if (!statusMessageId) {
            const statusMessage = await channel.send({
                embeds: [mainServerEmbed],
                components: [row],
                content: ''
            });
            statusMessageId = statusMessage.id;
        } else {
            const statusMessage = await channel.messages.fetch(statusMessageId);
            await statusMessage.edit({
                embeds: [mainServerEmbed],
                components: [row],
                content: ''
            });
        }
    } catch (error) {
        console.error('Error sending or updating message:', error.message || error);
    }
}

async function startUpdatingStatus(channelId) {
    await sendOrUpdateStatusMessage(channelId);
    setInterval(async () => {
        await sendOrUpdateStatusMessage(channelId);
    }, 300000);
}

client.on('messageCreate', async (message) => {
    if (message.content === '!start') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You need Administrator permissions to use this command. | ليست لديك الصلاحية لأستعمال هذا الأمر.');
        }

        const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        if (!process.env.CHANNEL_ID) {
            return message.reply('The specified channel was not found.');
        }

        message.reply('Starting the Minecraft server status updates...');
        await startUpdatingStatus(process.env.CHANNEL_ID);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const server = interaction.customId === 'lobby' ? servers['HeatexMc Lobby'] : servers['HeatexMc RedPvP'];
    const statusEmbed = await getMinecraftServerStatus(server);

    await interaction.reply({ embeds: [statusEmbed], ephemeral: true, flags: 64 });
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);
