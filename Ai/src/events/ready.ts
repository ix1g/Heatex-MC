import { Client, ActivityType } from 'discord.js';

module.exports = {
    name: 'ready',
    once: true,
    execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
        
        // Set up rotating presence
        const activities = [
            { name: 'AI Assistant', type: ActivityType.Playing },
            { name: 'Learning new things', type: ActivityType.Playing } // Example activity
            // Add more activities as needed
            // { name: 'Another activity', type: ActivityType.Watching },
            // { name: 'Playing a game', type: ActivityType.Playing },
            // { name: 'Listening to music', type: ActivityType.Listening },
            // { name: 'Streaming', type: ActivityType.Streaming },
            // { name: 'Custom status', type: ActivityType.Custom }
            // you can use emojis with them i've removed the emojis for now maybe in the feutre i'll add it once i have great emojis
        ];
        
        let currentActivity = 0;
        
        // Update presence every 10 seconds
        setInterval(() => {
            const activity = activities[currentActivity];
            client.user?.setPresence({
                activities: [activity],
                status: 'online'
            });
            // Log the current activity
            // rotate the activity
            // console.log(`Activity set to: ${activity.name} (${ActivityType[activity.type]})`); <-- You can add that for the console if you would watch live activity rotating in the console
            currentActivity = (currentActivity + 1) % activities.length;
        }, 10000);
    },
};