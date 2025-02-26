const Alexa = require('ask-sdk-core');
const { claudeClient, claudeConfig } = require('../config/claude.config');
const { handleClaudeError } = require('../utils/errorHandler');

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskClaudeIntent';
    },
    async handle(handlerInput) {
        console.log('Claude handler invoked');
        
        // Check if Claude client is available
        if (!claudeClient) {
            console.error('Claude client is not initialized');
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
            console.log(`Sending question to Claude: "${question}"`);
            
            // Log the configuration being used
            console.log('Using Claude configuration:');
            console.log('- Model:', process.env.CLAUDE_MODEL || claudeConfig.defaultModel);
            console.log('- Max Tokens:', parseInt(process.env.MAX_TOKENS) || claudeConfig.defaultMaxTokens);
            console.log('- Temperature:', claudeConfig.defaultTemperature);
            console.log('- System Prompt:', claudeConfig.defaultSystemPrompt);
            
            // Verify Claude client is available
            if (!claudeClient) {
                console.error('Claude client is not initialized');
                throw new Error('Claude client is not initialized');
            }
            
            // Log the API request payload
            const requestPayload = {
                model: process.env.CLAUDE_MODEL || claudeConfig.defaultModel,
                max_tokens: parseInt(process.env.MAX_TOKENS) || claudeConfig.defaultMaxTokens,
                temperature: claudeConfig.defaultTemperature,
                system: claudeConfig.defaultSystemPrompt,
                messages: [{
                    role: 'user',
                    content: question
                }]
            };
            
            console.log('Claude API request payload:', JSON.stringify(requestPayload, null, 2));
            
            const message = await claudeClient.messages.create(requestPayload);

            console.log('Claude API response:', JSON.stringify(message, null, 2));
            
            // Ensure we have a valid response from Claude
            if (!message || !message.content || !message.content[0] || !message.content[0].text) {
                console.error('Invalid response structure from Claude API');
                return handlerInput.responseBuilder
                    .speak('I received an unexpected response format. Please try again later.')
                    .reprompt('Is there something else I can help you with?')
                    .getResponse();
            }

            const speakOutput = message.content[0].text;
            console.log(`Claude response: "${speakOutput.substring(0, 100)}..."`);
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('What else would you like to know?')
                .getResponse();
        } catch (error) {
            return handleClaudeError(handlerInput, error);
        }
    }
};
