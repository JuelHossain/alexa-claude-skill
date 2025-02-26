const { Anthropic } = require('@anthropic-ai/sdk');

const initializeClaude = () => {
    try {
        console.log('Initializing Claude client...');
        
        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('ANTHROPIC_API_KEY is not defined in environment variables');
            throw new Error('ANTHROPIC_API_KEY is required');
        }
        
        // Check if API key has the expected format (starts with 'sk-ant')
        if (!process.env.ANTHROPIC_API_KEY.startsWith('sk-ant')) {
            console.error('ANTHROPIC_API_KEY does not have the expected format (should start with sk-ant)');
            console.error('API key prefix:', process.env.ANTHROPIC_API_KEY.substring(0, 6));
        }
        
        console.log('Creating Anthropic client with API key length:', process.env.ANTHROPIC_API_KEY.length);
        
        const client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        
        console.log('Claude client initialized successfully');
        return client;
    } catch (error) {
        console.error('Claude initialization error:', error);
        console.error('Error stack:', error.stack);
        throw error; // Re-throw to be caught by the main try-catch
    }
};

// Claude API configuration
const claudeConfig = {
    defaultModel: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620',
    defaultMaxTokens: parseInt(process.env.MAX_TOKENS) || 1024,
    defaultTemperature: 0.7,
    defaultSystemPrompt: "You are a helpful AI assistant. Provide concise responses suitable for voice interaction."
};

let claudeClient = null;
try {
    claudeClient = initializeClaude();
} catch (error) {
    console.error('Failed to initialize Claude client:', error);
}

module.exports = {
    claudeClient,
    claudeConfig
};
