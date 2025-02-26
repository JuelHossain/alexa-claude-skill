// lib/container.js
const config = require('../config');
const ClaudeService = require('../services/claudeService');
const LoggerService = require('../services/loggerService');

class Container {
  constructor() {
    this.services = {};
  }

  initialize() {
    try {
      // Initialize Logger service first
      const loggerService = new LoggerService(config.logging);
      this.services.loggerService = loggerService;
      
      // Log initialization
      console.log('Container: Initializing services...');
      
      // Initialize Claude service
      try {
        const claudeService = new ClaudeService(config.claude);
        claudeService.initialize();
        this.services.claudeService = claudeService;
        console.log('Container: Claude service initialized');
      } catch (error) {
        console.error('Container: Failed to initialize Claude service', error);
        // Continue even if Claude service fails to initialize
      }
      
      console.log('Container: All services initialized');
      return this;
    } catch (error) {
      console.error('Container initialization error:', error);
      // Return the container even if initialization fails
      return this;
    }
  }

  get(serviceName) {
    return this.services[serviceName];
  }
}

// Create and initialize the container
const container = new Container().initialize();

module.exports = container;
