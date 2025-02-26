// utils/testUtils.js
const container = require('../lib/container');

class TestUtils {
  static createTestRequest(type, intentName = null, questionText = null) {
    const request = {
      version: '1.0',
      session: {
        new: type === 'LaunchRequest',
        sessionId: 'test-session-id',
        application: {
          applicationId: 'test-app-id'
        },
        user: {
          userId: 'test-user-id'
        }
      },
      context: {
        System: {
          application: {
            applicationId: 'test-app-id'
          },
          user: {
            userId: 'test-user-id'
          }
        }
      },
      request: {
        type: type,
        requestId: 'test-request-id',
        timestamp: new Date().toISOString(),
        locale: 'en-US'
      }
    };

    if (type === 'IntentRequest' && intentName) {
      request.request.intent = {
        name: intentName,
        confirmationStatus: 'NONE'
      };

      if (intentName === 'AskClaudeIntent' && questionText) {
        request.request.intent.slots = {
          question: {
            name: 'question',
            value: questionText,
            confirmationStatus: 'NONE'
          }
        };
      }
    }

    return request;
  }

  static async testIntent(intentName, slotValue = null) {
    const logger = container.get('loggerService');
    logger.info(`Testing intent: ${intentName}`, { slotValue });
    
    const request = this.createTestRequest('IntentRequest', intentName, slotValue);
    const localHandler = require('../index').localHandler;
    
    try {
      const response = await localHandler(request);
      logger.info('Test response received', { response });
      return response;
    } catch (error) {
      logger.error('Test error', error);
      throw error;
    }
  }
}

module.exports = TestUtils;
