import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { aiService } from '../utils/aiService';
// import { rateLimiter } from '../utils/rateLimiter';
// import { config } from '../config/config';
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-memory')
        .setDescription('Reset the AI conversation memory'),
    
    async execute(interaction: CommandInteraction) {
        aiService.resetMemory(interaction.user.id);
        await interaction.reply({ 
            content: '🔄 Memory has been reset successfully!',
            ephemeral: true 
        });
    },
};