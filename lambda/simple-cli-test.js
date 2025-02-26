/**
 * Simple CLI Test for Alexa Claude Skill
 * This file provides a simple way to test the Alexa skill without any dependencies
 */

require('dotenv').config();
const { handler } = require('./index');

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

// Function to print response in a nice format
function printResponse(response) {
    if (response && response.response && response.response.outputSpeech) {
        const speech = response.response.outputSpeech.ssml.replace(/<[^>]*>/g, '');
        console.log('\nAlexa Response:');
        console.log(speech);
        
        if (response.response.reprompt) {
            const reprompt = response.response.reprompt.outputSpeech.ssml.replace(/<[^>]*>/g, '');
            console.log('\nReprompt:');
            console.log(reprompt);
        }
    } else {
        console.log('Invalid response format:', response);
    }
    console.log('\n-----------------------------------\n');
}

// Main test function
async function runTests() {
    try {
        console.log('=== Starting Alexa Skill Tests ===\n');
        
        // Test 1: Launch Request
        console.log('\nTesting Launch Request...');
        const launchRequest = createTestRequest('LaunchRequest');
        const launchResponse = await handler(launchRequest);
        printResponse(launchResponse);

        // Test 2: Help Intent
        console.log('\nTesting Help Intent...');
        const helpRequest = createTestRequest('IntentRequest', 'AMAZON.HelpIntent');
        const helpResponse = await handler(helpRequest);
        printResponse(helpResponse);

        // Test 3: Ask Claude Intent
        const testQuestion = process.argv[2] || 'What is artificial intelligence?';
        console.log(`\nTesting Ask Claude Intent with question: "${testQuestion}"...`);
        const askRequest = createTestRequest('IntentRequest', 'AskClaudeIntent', testQuestion);
        const askResponse = await handler(askRequest);
        printResponse(askResponse);

        // Test 4: Stop Intent
        console.log('\nTesting Stop Intent...');
        const stopRequest = createTestRequest('IntentRequest', 'AMAZON.StopIntent');
        const stopResponse = await handler(stopRequest);
        printResponse(stopResponse);

        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('Error during testing:', error);
    }
}

// Run the tests
runTests();
