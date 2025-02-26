/**
 * Alexa Skill Local Tester
 * This file provides a simple way to test the Alexa skill locally without deploying to AWS.
 * It includes both a CLI mode and an Express server for testing via web interface.
 */

require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { localHandler } = require('./index');

// If localHandler is not available, fall back to the regular handler
const handler = localHandler || require('./index').handler;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Initialize logger
const logFile = path.join(logsDir, `test-${new Date().toISOString().replace(/:/g, '-')}.log`);
fs.writeFileSync(logFile, '=== Alexa Skill Test Logs ===\n\n');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.log('-----------------------------------');
    console.log(message);
    console.log('-----------------------------------');
}

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

// Create test requests
function createTestRequest(type, intentName = null, questionText = null) {
    const request = {
        version: '1.0',
        session: {
            new: type === 'LaunchRequest',
            sessionId: `test-session-${Date.now()}`,
            application: { applicationId: 'amzn1.ask.skill.test-skill-id' },
            user: { userId: 'test-user-id' }
        },
        context: {
            System: {
                application: {
                    applicationId: 'amzn1.ask.skill.test-skill-id'
                },
                user: {
                    userId: 'test-user-id'
                }
            }
        },
        request: type === 'LaunchRequest' 
            ? {
                type: 'LaunchRequest',
                requestId: `test-${Date.now()}`,
                timestamp: new Date().toISOString(),
                locale: 'en-US'
            }
            : {
                type: 'IntentRequest',
                requestId: `test-${Date.now()}`,
                timestamp: new Date().toISOString(),
                locale: 'en-US',
                intent: {
                    name: intentName,
                    slots: questionText ? {
                        question: {
                            name: 'question',
                            value: questionText
                        }
                    } : {}
                }
            }
    };
    return request;
}

// CLI mode functions
async function runCliTests() {
    try {
        log('=== Starting CLI Tests ===');
        
        // Verify handler is a function
        if (typeof handler !== 'function') {
            log('ERROR: handler is not a function. Type: ' + typeof handler);
            log('Handler value: ' + JSON.stringify(handler));
            return;
        }
        
        // Test 1: Launch Request
        log('\nTesting Launch Request...');
        try {
            const launchRequest = createTestRequest('LaunchRequest');
            log('Launch Request:');
            log(JSON.stringify(launchRequest, null, 2));
            
            const launchResponse = await handler(launchRequest);
            log('Launch Response:');
            log(JSON.stringify(launchResponse, null, 2));
            
            const speech = getSpeechFromResponse(launchResponse);
            if (speech) {
                log('Launch Speech: ' + speech);
            } else {
                log('ERROR: Invalid launch response structure:');
                log(JSON.stringify(launchResponse, null, 2));
            }
        } catch (error) {
            log(`Error during launch request: ${error}`);
            log(`Error stack: ${error.stack}`);
        }

        // Test 2: Help Intent
        log('\nTesting Help Intent...');
        try {
            const helpRequest = createTestRequest('IntentRequest', 'AMAZON.HelpIntent');
            const helpResponse = await handler(helpRequest);
            log('Help Response:');
            log(JSON.stringify(helpResponse, null, 2));
            
            const speech = getSpeechFromResponse(helpResponse);
            if (speech) {
                log('Help Speech: ' + speech);
            } else {
                log('ERROR: Invalid help response structure:');
                log(JSON.stringify(helpResponse, null, 2));
            }
        } catch (error) {
            log(`Error during help request: ${error}`);
            log(`Error stack: ${error.stack}`);
        }

        // Test 3: Ask Claude Intent
        const testQuestion = process.argv[2] || 'What is artificial intelligence?';
        log(`\nTesting Ask Claude Intent with question: "${testQuestion}"...`);
        try {
            const askRequest = createTestRequest('IntentRequest', 'AskClaudeIntent', testQuestion);
            const askResponse = await handler(askRequest);
            log('Claude Response:');
            log(JSON.stringify(askResponse, null, 2));
            
            const speech = getSpeechFromResponse(askResponse);
            if (speech) {
                log('Claude Speech: ' + speech);
            } else {
                log('ERROR: Invalid Claude response structure:');
                log(JSON.stringify(askResponse, null, 2));
            }
        } catch (error) {
            log(`Error during Claude request: ${error}`);
            log(`Error stack: ${error.stack}`);
        }

        // Test 4: Stop Intent
        log('\nTesting Stop Intent...');
        try {
            const stopRequest = createTestRequest('IntentRequest', 'AMAZON.StopIntent');
            const stopResponse = await handler(stopRequest);
            log('Stop Response:');
            log(JSON.stringify(stopResponse, null, 2));
            
            const speech = getSpeechFromResponse(stopResponse);
            if (speech) {
                log('Stop Speech: ' + speech);
            } else {
                log('ERROR: Invalid stop response structure:');
                log(JSON.stringify(stopResponse, null, 2));
            }
        } catch (error) {
            log(`Error during stop request: ${error}`);
            log(`Error stack: ${error.stack}`);
        }

        log('\nAll tests completed!');
    } catch (error) {
        log(`Error during testing: ${error}`);
        log(`Error stack: ${error.stack}`);
    }
}

// Express server mode
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
    log(`${req.method} ${req.path}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    log(`Error: ${err.stack}`);
    res.status(500).json({ error: err.message });
});

// Test endpoints
app.post('/test/launch', async (req, res) => {
    try {
        log('Testing Launch Request from web');
        const request = createTestRequest('LaunchRequest');
        const response = await handler(request);
        const speech = getSpeechFromResponse(response);
        log(`Launch Response: ${speech || 'No speech found'}`);
        res.json(response);
    } catch (error) {
        log(`Launch Error: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

app.post('/test/ask', async (req, res) => {
    try {
        const { question } = req.body;
        log(`Testing Ask Claude Intent from web with question: ${question}`);
        const request = createTestRequest('IntentRequest', 'AskClaudeIntent', question);
        const response = await handler(request);
        const speech = getSpeechFromResponse(response);
        log(`Ask Claude Response: ${speech || 'No speech found'}`);
        res.json(response);
    } catch (error) {
        log(`Ask Claude Error: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

app.post('/test/help', async (req, res) => {
    try {
        log('Testing Help Intent from web');
        const request = createTestRequest('IntentRequest', 'AMAZON.HelpIntent');
        const response = await handler(request);
        const speech = getSpeechFromResponse(response);
        log(`Help Response: ${speech || 'No speech found'}`);
        res.json(response);
    } catch (error) {
        log(`Help Error: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

app.post('/test/stop', async (req, res) => {
    try {
        log('Testing Stop Intent from web');
        const request = createTestRequest('IntentRequest', 'AMAZON.StopIntent');
        const response = await handler(request);
        const speech = getSpeechFromResponse(response);
        log(`Stop Response: ${speech || 'No speech found'}`);
        res.json(response);
    } catch (error) {
        log(`Stop Error: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Decide whether to run CLI mode or server mode
const runMode = process.argv[3] || 'server';

if (runMode === 'cli') {
    runCliTests();
} else {
    // Start server with error handling
    try {
        const server = app.listen(port, () => {
            log(`Test server running at http://localhost:${port}`);
            log(`Access the web tester at http://localhost:${port}/index.html`);
        });

        server.on('error', (error) => {
            log(`Server error: ${error}`);
            if (error.code === 'EADDRINUSE') {
                log(`Port ${port} is already in use. Please try a different port or close the application using this port.`);
            }
        });

        process.on('uncaughtException', (error) => {
            log(`Uncaught Exception: ${error}`);
        });

        process.on('unhandledRejection', (reason, promise) => {
            log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
        });
    } catch (error) {
        log(`Failed to start server: ${error}`);
    }
}

// Export functions for potential use in other test scripts
module.exports = {
    createTestRequest,
    log
};
