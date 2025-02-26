/**
 * Simple test script for Claude API
 */

// Load environment variables
require('dotenv').config();
const { Anthropic } = require('@anthropic-ai/sdk');

async function testClaude() {
    try {
        console.log('Testing Claude API connection...');
        console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
        console.log('API Key length:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 0);
        console.log('API Key prefix:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 6) : 'none');
        
        // Create Claude client
        const client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        
        // Test message creation
        console.log('Testing message creation...');
        const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620';
        console.log('Using model:', model);
        
        const message = await client.messages.create({
            model: model,
            max_tokens: 1024,
            temperature: 0.7,
            system: "You are a helpful AI assistant.",
            messages: [{
                role: 'user',
                content: 'Hello, Claude! Please respond with a short greeting.'
            }]
        });
        
        console.log('Message response:', JSON.stringify(message, null, 2));
        console.log('Response content:', message.content[0].text);
        console.log('Test completed successfully!');
    } catch (error) {
        console.error('Test failed with error:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', JSON.stringify(error, null, 2));
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testClaude();
