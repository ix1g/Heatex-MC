import { REST, Routes } from 'discord.js';
import { config } from './config/config';
import fs from 'fs';
import path from 'path';

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands Just let me cook for you.`);

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands },
        );

        console.log(`I've cooked for you --> Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();