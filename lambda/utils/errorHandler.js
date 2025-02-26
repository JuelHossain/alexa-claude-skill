/**
 * Error handler utility for Claude API errors
 */
const container = require('../lib/container');

const handleClaudeError = (handlerInput, error) => {
    const logger = container.get('loggerService');
    logger.error('Claude API Error', error);
    
    // Determine appropriate error message based on error type
    let errorMessage = 'I\'m having trouble connecting to my knowledge source. Please try again later.';
    let debugInfo = '';
    
    if (error.status === 401 || error.status === 403) {
        logger.error('Authentication error with Claude API');
        errorMessage = 'I\'m having trouble with my authorization. Please contact the skill developer.';
        debugInfo = 'Authentication error (401/403)';
    } else if (error.status === 429) {
        logger.error('Rate limit exceeded with Claude API');
        errorMessage = 'I\'ve reached my usage limit. Please try again later.';
        debugInfo = 'Rate limit exceeded (429)';
    } else if (error.status >= 500) {
        logger.error('Claude API server error');
        errorMessage = 'My knowledge source is currently unavailable. Please try again later.';
        debugInfo = 'Server error (500+)';
    } else if (error.message && error.message.includes('timeout')) {
        logger.error('Claude API timeout');
        errorMessage = 'The request to my knowledge source timed out. Please try again later.';
        debugInfo = 'Request timeout';
    } else if (error.message) {
        debugInfo = `Error message: ${error.message}`;
    }
    
    logger.error('Error diagnosis:', debugInfo);
    
    return handlerInput.responseBuilder
        .speak(errorMessage)
        .reprompt('Is there something else I can help you with?')
        .getResponse();
};

module.exports = {
    handleClaudeError,
    
    // General error handler for the skill
    errorHandler: {
        canHandle() {
            return true;
        },
        handle(handlerInput, error) {
            const logger = container.get('loggerService');
            logger.error('Error handled:', error);
            logger.error('Error stack:', error.stack);
            
            const speakOutput = 'Sorry, I had trouble processing your request. Please try again.';
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
    }
};
