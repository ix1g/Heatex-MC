import { Client, ActivityType } from 'discord.js';

module.exports = {
    name: 'ready',
    once: true,
    execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
        
        // Set up rotating presence
        const activities = [
            { name: '🤖 AI Assistant', type: ActivityType.Playing },
            { name: '💭 Processing thoughts', type: ActivityType.Playing },
            { name: '🔄 Learning new things', type: ActivityType.Playing },
            { name: '/help for commands', type: ActivityType.Watching }
        ];
        
        let currentActivity = 0;
        
        // Update presence every 10 seconds
        setInterval(() => {
            const activity = activities[currentActivity];
            client.user?.setPresence({
                activities: [activity],
                status: 'online'
            });
            
            currentActivity = (currentActivity + 1) % activities.length;
        }, 10000);
    },
};