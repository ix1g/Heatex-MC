import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands and features'),
    
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🤖 AI Assistant Help')
            .setDescription('Here are all the available commands and features:')
            .addFields(
                { 
                    name: '💬 Chat with AI',
                    value: 'Simply mention the bot or use the AI channel to start a conversation.'
                },
                {
                    name: '🖼️ Image Analysis',
                    value: 'Upload an image along with your message to analyze its contents.'
                },
                {
                    name: '🔄 /reset-memory',
                    value: 'Resets your conversation history with the AI.'
                },
                {
                    name: '❓ /help',
                    value: 'Shows this help message.'
                },
                {
                    name: '⚠️ Rate Limits',
                    value: 'To prevent spam, there are limits on how frequently you can send messages.'
                }
            )
            .setFooter({ text: 'Powered by Gemini AI' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};