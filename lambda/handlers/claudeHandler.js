const Alexa = require('ask-sdk-core');
const container = require('../lib/container');
const { handleClaudeError } = require('../utils/errorHandler');

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskClaudeIntent';
    },
    async handle(handlerInput) {
        console.log('Claude handler invoked');
        
        const claudeService = container.get('claudeService');
        const logger = container.get('loggerService');
        
        // Check if Claude service is available
        if (!claudeService || !claudeService.client) {
            logger.error('Claude service is not initialized');
            return handlerInput.responseBuilder
                .speak('I\'m sorry, but I\'m having trouble connecting to my knowledge source. Please try again later.')
                .reprompt('Is there something else I can help you with?')
                .getResponse();
        }
        
        const question = handlerInput.requestEnvelope.request.intent.slots.question.value;
        
        if (!question?.trim()) {
            return handlerInput.responseBuilder
                .speak('I didn\'t catch your question. Could you please ask again?')
                .reprompt('Please ask your question again.')
                .getResponse();
        }
        
        try {
            logger.info('Processing question', { question });
            
            const answer = await claudeService.askQuestion(question);
            
            return handlerInput.responseBuilder
                .speak(answer)
                .reprompt('Is there anything else you would like to know?')
                .getResponse();
        } catch (error) {
            return handleClaudeError(handlerInput, error);
        }
    }
};
