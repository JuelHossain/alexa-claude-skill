/**
 * Alexa Skill with Claude AI - Main Lambda Handler
 */

// Load environment variables
require('dotenv').config();

// Core dependencies
const Alexa = require('ask-sdk-core');

// Import configuration
const environment = require('./config/environment');

// Import handlers
const {
    launchHandler,
    claudeHandler,
    helpHandler,
    cancelStopHandler,
    sessionEndedHandler
} = require('./handlers');

// Import middleware
const { 
    requestInterceptor,
    responseInterceptor
} = require('./middlewares/loggingMiddleware');

// Import error handler
const { errorHandler } = require('./utils/errorHandler');

// Initialize environment
try {
    console.log('Starting environment initialization...');
    environment.initialize();
    console.log('Environment initialization completed successfully');
} catch (error) {
    console.error('Error during environment initialization:', error);
    console.error('Error stack:', error.stack);
}

/**
 * Lambda handler function
 */
try {
    console.log('Building Alexa skill...');
    const skillBuilder = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
            launchHandler,
            claudeHandler,
            helpHandler,
            cancelStopHandler,
            sessionEndedHandler
        )
        .addRequestInterceptors(requestInterceptor)
        .addResponseInterceptors(responseInterceptor)
        .addErrorHandlers(errorHandler);
    
    // For AWS Lambda environment
    exports.handler = skillBuilder.lambda();
    
    // For local testing, create a non-lambda handler
    exports.localHandler = async function(event) {
        return skillBuilder.create().invoke(event);
    };
    
    console.log('Alexa skill built successfully');
} catch (error) {
    console.error('Error building Alexa skill:', error);
    console.error('Error stack:', error.stack);
    // Provide a fallback handler that returns an error response
    exports.handler = async (event) => {
        console.error('Using fallback handler due to initialization error');
        return {
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'SSML',
                    ssml: '<speak>Sorry, there was an error initializing the skill. Please try again later.</speak>'
                },
                shouldEndSession: true
            }
        };
    };
}
