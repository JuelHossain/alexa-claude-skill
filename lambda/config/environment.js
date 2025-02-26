/**
 * Environment configuration
 */

// Default values for environment variables
const defaults = {
    CLAUDE_MODEL: 'claude-3-5-sonnet-20240620',
    MAX_TOKENS: 1024
};

// Validate required environment variables
const validateEnvironment = () => {
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error('ERROR: Missing required environment variable ANTHROPIC_API_KEY');
        process.exit(1);
    }
};

// Set default values for optional environment variables
const setDefaults = () => {
    process.env.CLAUDE_MODEL = process.env.CLAUDE_MODEL || defaults.CLAUDE_MODEL;
    process.env.MAX_TOKENS = process.env.MAX_TOKENS || defaults.MAX_TOKENS;
};

// Initialize environment
const initialize = () => {
    console.log('Initializing environment...');
    console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('ANTHROPIC_API_KEY length:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 0);
    
    validateEnvironment();
    setDefaults();
    
    console.log('Environment initialized with:');
    console.log('- CLAUDE_MODEL:', process.env.CLAUDE_MODEL);
    console.log('- MAX_TOKENS:', process.env.MAX_TOKENS);
};

module.exports = {
    initialize
};
