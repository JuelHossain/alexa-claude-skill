/**
 * Logging middleware for request and response interceptors
 */

// Request interceptor for logging incoming requests
const requestInterceptor = {
    process(handlerInput) {
        const { requestEnvelope } = handlerInput;
        console.log(`REQUEST [${requestEnvelope.request.type}]: ${JSON.stringify(requestEnvelope)}`);
    }
};

// Response interceptor for logging outgoing responses
const responseInterceptor = {
    process(handlerInput, response) {
        console.log(`RESPONSE: ${JSON.stringify(response)}`);
        return response;
    }
};

module.exports = {
    requestInterceptor,
    responseInterceptor
};
