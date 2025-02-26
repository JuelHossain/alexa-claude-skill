// services/loggerService.js
class LoggerService {
  constructor(config) {
    this.config = config;
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };
    
    console.log(JSON.stringify(logEntry));
  }

  info(message, data = {}) {
    this.log('INFO', message, data);
  }

  error(message, error, data = {}) {
    const errorData = {
      error: {
        message: error.message,
        stack: error.stack,
        ...error
      },
      ...data
    };
    
    this.log('ERROR', message, errorData);
  }

  debug(message, data = {}) {
    if (this.config.detailedErrors) {
      this.log('DEBUG', message, data);
    }
  }

  request(requestEnvelope) {
    if (this.config.requestResponse) {
      this.log('REQUEST', `Received ${requestEnvelope.request.type}`, { request: requestEnvelope });
    }
  }

  response(response) {
    if (this.config.requestResponse) {
      this.log('RESPONSE', 'Sending response', { response });
    }
  }
}

module.exports = LoggerService;
