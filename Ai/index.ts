import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Tesseract from 'tesseract.js';

dotenv.config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

const token = process.env.DISCORD_TOKEN;
const aiChannelId = process.env.AI_CHANNEL_ID;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(geminiApiKey!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let memory: Record<string, string[]> = {};

// Chat history for each user
const chatHistory: Record<string, { role: string; parts: string }[]> = {};

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

async function processImage(url: string): Promise<string> {
    try {
        const { data: { text } } = await Tesseract.recognize(url, 'eng');
        return text;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
}

async function getAIResponse(userId: string, input: string): Promise<string> {
    try {
        if (!chatHistory[userId]) {
            chatHistory[userId] = [];
        }

        // Add user message to history
        chatHistory[userId].push({ role: "user", parts: input });

        const chat = model.startChat({
            history: chatHistory[userId],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(input);
        const response = await result.response;
        const responseText = response.text();

        // Add AI response to history
        chatHistory[userId].push({ role: "model", parts: responseText });

        // Limit history to last 10 messages
        if (chatHistory[userId].length > 20) {
            chatHistory[userId] = chatHistory[userId].slice(-20);
        }

        return responseText;
    } catch (error) {
        console.error('Error getting AI response:', error);
        return "Sorry, I encountered an error processing your request.";
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const isAIChannel = message.channel.id === aiChannelId;
    const isMentioned = message.mentions.has(client.user!);

    if (isAIChannel || isMentioned) {
        await message.channel.sendTyping();

        try {
            let userInput = message.content;
            
            // Remove bot mention from the message
            if (isMentioned) {
                userInput = userInput.replace(/<@!\d+>/, '').trim();
            }

            // Handle image processing
            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                if (attachment && attachment.contentType?.startsWith('image/')) {
                    const extractedText = await processImage(attachment.url);
                    userInput = `Image text: ${extractedText}\n\nPlease analyze this text: ${userInput}`;
                }
            }

            const response = await getAIResponse(message.author.id, userInput);
            await message.reply(response);

        } catch (error) {
            console.error('Error processing message:', error);
            await message.reply('Sorry, I encountered an error processing your request.');
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'reset-memory') {
        delete chatHistory[interaction.user.id];
        memory[interaction.user.id] = [];
        await interaction.reply('Memory has been reset.');
    }
});

const commands = [
    {
        name: 'reset-memory',
        description: 'Reset the bot memory for your conversations.',
    }
];

(async () => {
    try {
        const rest = new REST({ version: '10' }).setToken(token!);
        await rest.put(
            Routes.applicationCommands(client.user?.id || 'YOUR_CLIENT_ID'),
            { body: commands }
        );
    } catch (error) {
        console.error('Error registering commands:', error);
    }
})();

client.login(token);