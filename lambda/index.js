/**
 * Alexa Skill with Claude AI - Main Lambda Handler
 */

// Load environment variables
require('dotenv').config();

// Core dependencies
const Alexa = require('ask-sdk-core');

// Import configuration and container
const config = require('./config');
const container = require('./lib/container');

// Get the logger service from the container
const logger = container.get('loggerService');

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

// Initialize skill
try {
    logger.info('Building Alexa skill...');
    
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
    
    // Export the lambda handler
    exports.handler = async (event) => {
        return skillBuilder.create().invoke(event);
    };
    
    // For local testing, create a non-lambda handler
    exports.localHandler = async (event) => {
        return skillBuilder.create().invoke(event);
    };
    
    logger.info('Alexa skill built successfully');
} catch (error) {
    logger.error('Error building Alexa skill', error);
    
    // Provide a fallback handler that returns an error response
    exports.handler = async (event) => {
        return {
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'SSML',
                    ssml: '<speak>Sorry, there was an error initializing this skill. Please try again later.</speak>'
                },
                shouldEndSession: true
            }
        };
    };
    
    exports.localHandler = exports.handler;
}
