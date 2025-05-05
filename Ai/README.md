# Discord AI Assistant Bot

A smart Discord bot powered by Gemini AI with image recognition, custom knowledge base, and memory management.

## Features
- Chat with AI using mentions or in designated channel
- Image analysis with text recognition
- Custom knowledge base to teach the AI
- Conversation memory management
- Rate limiting and spam prevention
- Rotating bot status
- TypeScript for better development

## Setup
1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Create .env file with:
   ```
   DISCORD_TOKEN=your-discord-bot-token
   CLIENT_ID=your-client-id
   GUILD_ID=your-guild-id
   AI_CHANNEL_ID=your-ai-channel-id
   GEMINI_API_KEY=your-gemini-api-key
   RATE_LIMIT_TIME=60000
   MAX_MESSAGES_PER_MINUTE=5
   ```
4. Deploy commands:
   ```
   npm run deploy-commands
   ```
5. Start the bot:
   ```
   npm run build
   npm start
   ```

## Commands
- `/help` - Show available commands
- `/reset-memory` - Clear your conversation history
- `/add-knowledge` - Teach the AI custom information

## Development
Run in dev mode with auto-reload:
```
npm run dev
```

Watch TypeScript changes:
```
npm run watch
```

## Using Custom Knowledge
1. Use `/add-knowledge` command with:
   - category: Topic group
   - key: Knowledge title
   - value: The information

The AI will use this knowledge in relevant conversations!