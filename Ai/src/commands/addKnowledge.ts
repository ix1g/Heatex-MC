import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { knowledgeManager } from '../utils/knowledgeManager';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-knowledge')
        .setDescription('Add custom knowledge for the AI to use')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category of the knowledge (e.g., rules, facts, procedures)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('key')
                .setDescription('The key or title for this knowledge')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('value')
                .setDescription('The actual knowledge or information to store')
                .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const category = interaction.options.get('category')?.value as string;
        const key = interaction.options.get('key')?.value as string;
        const value = interaction.options.get('value')?.value as string;

        try {
            knowledgeManager.addKnowledge(category, key, value);
            await interaction.reply({
                content: `✅ Successfully added knowledge:\nCategory: ${category}\nKey: ${key}\nValue: ${value}`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error adding knowledge:', error);
            await interaction.reply({
                content: '❌ Failed to add knowledge. Please try again.',
                ephemeral: true
            });
        }
    },
};