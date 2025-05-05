import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { config } from './src/config/config';
import { aiService } from './src/utils/aiService';
import { rateLimiter } from './src/utils/rateLimiter';
import fs from 'fs';
import path from 'path';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, any>;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// Load events
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Handle commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error executing this command!',
            ephemeral: true
        });
    }
});

// Handle messages
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const isAIChannel = message.channel.id === config.aiChannelId;
    const isMentioned = message.mentions.has(client.user!);

    if (isAIChannel || isMentioned) {
        // Check rate limit
        if (rateLimiter.isRateLimited(message.author.id)) {
            const timeLeft = rateLimiter.getRemainingTime(message.author.id);
            const seconds = Math.ceil(timeLeft / 1000);
            await message.reply(`⚠️ Please wait ${seconds} seconds before sending another message.`);
            return;
        }

        await message.channel.sendTyping();

        try {
            let userInput = message.content;
            if (isMentioned) {
                userInput = userInput.replace(/<@!\d+>/, '').trim();
            }

            let response: string;

            // Handle image processing
            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                if (attachment && attachment.contentType?.startsWith('image/')) {
                    response = await aiService.processImage(
                        attachment.url,
                        userInput || 'Please analyze this image.'
                    );
                } else {
                    response = 'I can only process image attachments.';
                }
            } else {
                response = await aiService.generateResponse(message.author.id, userInput);
            }

            await message.reply(response);

        } catch (error) {
            console.error('Error processing message:', error);
            await message.reply('I encountered an error processing your message. Please try again.');
        }
    }
});

client.login(config.token);