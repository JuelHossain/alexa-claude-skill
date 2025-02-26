/**
 * Logging middleware for request and response interceptors
 */
const container = require('../lib/container');

// Request interceptor for logging incoming requests
const requestInterceptor = {
    process(handlerInput) {
        const logger = container.get('loggerService');
        logger.request(handlerInput.requestEnvelope);
    }
};

// Response interceptor for logging outgoing responses
const responseInterceptor = {
    process(handlerInput, response) {
        const logger = container.get('loggerService');
        logger.response(response);
        return response;
    }
};

module.exports = {
    requestInterceptor,
    responseInterceptor
};
