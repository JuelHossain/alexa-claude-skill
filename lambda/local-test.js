/**
 * Alexa Skill Local Tester
 * This file provides a simple way to test the Alexa skill locally without deploying to AWS.
 * It includes both a CLI mode and an Express server for testing via web interface.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const TestUtils = require('./utils/testUtils');
const container = require('./lib/container');

// Get logger
const logger = container.get('loggerService');

// Helper function to safely extract speech from response
function getSpeechFromResponse(response) {
    if (!response) {
        return null;
    }
    
    // Check if response has outputSpeech directly (new format)
    if (response.outputSpeech && response.outputSpeech.ssml) {
        return response.outputSpeech.ssml;
    }
    
    // Check if response has nested response.outputSpeech (old format)
    if (response.response && response.response.outputSpeech && response.response.outputSpeech.ssml) {
        return response.response.outputSpeech.ssml;
    }
    
    // No valid speech found
    return null;
}

// CLI mode function
async function runCliTests() {
    try {
        const args = process.argv.slice(2);
        const questionText = args[0] || 'What is artificial intelligence?';
        
        logger.info('Running CLI test with question:', { question: questionText });
        
        const response = await TestUtils.testIntent('AskClaudeIntent', questionText);
        const speech = getSpeechFromResponse(response);
        
        logger.info('Claude response:', { speech });
        
        process.exit(0);
    } catch (error) {
        logger.error('CLI test error', error);
        console.error(error);
        process.exit(1);
    }
}

// Test mode function
async function runTest(question) {
    try {
        logger.info('Running test with question:', { question });
        
        const response = await TestUtils.testIntent('AskClaudeIntent', question);
        const speech = getSpeechFromResponse(response);
        
        logger.info('Claude response:', { speech });
        
        // Clean up SSML tags for console output
        const cleanSpeech = speech ? speech.replace(/<[^>]*>/g, '') : 'No response';
        console.log('\nQuestion:', question);
        console.log('Answer:', cleanSpeech);
        
        process.exit(0);
    } catch (error) {
        logger.error('Test error', error);
        console.error(error);
        process.exit(1);
    }
}

// Express server mode
function startServer() {
    const app = express();
    const port = process.env.PORT || 3001;
    
    // Serve static files
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());
    
    // API endpoint for testing the skill
    app.post('/api/ask', async (req, res) => {
        try {
            const { question } = req.body;
            
            if (!question) {
                return res.status(400).json({ error: 'Question is required' });
            }
            
            logger.info('Web request received', { question });
            
            const response = await TestUtils.testIntent('AskClaudeIntent', question);
            const speech = getSpeechFromResponse(response);
            
            // Clean up SSML tags for web display
            const cleanSpeech = speech ? speech.replace(/<[^>]*>/g, '') : 'No response';
            
            return res.json({ 
                question, 
                answer: cleanSpeech,
                rawResponse: response
            });
        } catch (error) {
            logger.error('API error', error);
            return res.status(500).json({ error: error.message });
        }
    });
    
    // Start the server
    app.listen(port, () => {
        logger.info(`Server running at http://localhost:${port}`);
        logger.info(`Test the skill at http://localhost:${port}/index.html`);
    });
}

// Determine which mode to run
if (process.argv.includes('cli')) {
    runCliTests();
} else if (process.argv.includes('test')) {
    // Get the question from the arguments (everything after "test")
    const testIndex = process.argv.indexOf('test');
    const question = process.argv[testIndex + 1] || 'What is artificial intelligence?';
    runTest(question);
} else if (process.argv.includes('server')) {
    startServer();
} else {
    logger.info('No mode specified, defaulting to server mode');
    startServer();
}
