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
    
    // API endpoints
    app.post('/api/test/launch', async (req, res) => {
        try {
            const response = await TestUtils.testIntent('LaunchRequest');
            res.json(response);
        } catch (error) {
            logger.error('Launch test error', error);
            res.status(500).json({ error: error.message });
        }
    });
    
    app.post('/api/test/claude', async (req, res) => {
        try {
            const { question } = req.body;
            const response = await TestUtils.testIntent('AskClaudeIntent', question);
            res.json(response);
        } catch (error) {
            logger.error('Claude test error', error);
            res.status(500).json({ error: error.message });
        }
    });
    
    app.post('/api/test/help', async (req, res) => {
        try {
            const response = await TestUtils.testIntent('AMAZON.HelpIntent');
            res.json(response);
        } catch (error) {
            logger.error('Help test error', error);
            res.status(500).json({ error: error.message });
        }
    });
    
    app.post('/api/test/stop', async (req, res) => {
        try {
            const response = await TestUtils.testIntent('AMAZON.StopIntent');
            res.json(response);
        } catch (error) {
            logger.error('Stop test error', error);
            res.status(500).json({ error: error.message });
        }
    });
    
    // Start server
    app.listen(port, () => {
        logger.info(`Server running at http://localhost:${port}`);
        logger.info(`Access the web tester at http://localhost:${port}/index.html`);
    });
}

// Determine which mode to run
if (process.argv.includes('cli')) {
    runCliTests();
} else if (process.argv.includes('server')) {
    startServer();
} else {
    logger.info('No mode specified, defaulting to server mode');
    startServer();
}
