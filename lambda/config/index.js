// config/index.js
require('dotenv').config();

const config = {
  claude: {
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620',
    maxTokens: parseInt(process.env.MAX_TOKENS) || 1024,
    temperature: 0.7,
    systemPrompt: "You are a helpful AI assistant. Provide concise responses suitable for voice interaction."
  },
  logging: {
    requestResponse: true,
    detailedErrors: process.env.NODE_ENV !== 'production'
  }
};

module.exports = config;
