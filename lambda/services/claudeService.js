// services/claudeService.js
const { Anthropic } = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor(config) {
    this.config = config;
    this.client = null;
  }

  initialize() {
    try {
      console.log('Initializing Claude client...');
      
      if (!process.env.ANTHROPIC_API_KEY) {
        console.error('ANTHROPIC_API_KEY is not defined in environment variables');
        throw new Error('ANTHROPIC_API_KEY is required');
      }
      
      // Check if API key has the expected format
      if (!process.env.ANTHROPIC_API_KEY.startsWith('sk-ant')) {
        console.error('ANTHROPIC_API_KEY does not have the expected format (should start with sk-ant)');
        console.error('API key prefix:', process.env.ANTHROPIC_API_KEY.substring(0, 6));
      }
      
      console.log('Creating Anthropic client with API key length:', process.env.ANTHROPIC_API_KEY.length);
      
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      
      console.log('Claude client initialized successfully');
      return this.client;
    } catch (error) {
      console.error('Claude initialization error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async askQuestion(question) {
    if (!this.client) {
      throw new Error('Claude client is not initialized');
    }

    console.log(`Sending question to Claude: "${question}"`);
    
    // Log the configuration being used
    console.log('Using Claude configuration:');
    console.log('- Model:', this.config.model);
    console.log('- Max Tokens:', this.config.maxTokens);
    console.log('- Temperature:', this.config.temperature);
    console.log('- System Prompt:', this.config.systemPrompt);
    
    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      system: this.config.systemPrompt,
      messages: [
        { role: 'user', content: question }
      ]
    });
    
    return response.content[0].text;
  }
}

module.exports = ClaudeService;
