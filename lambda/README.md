# Alexa Claude Skill

An Alexa skill that integrates with Claude AI to provide intelligent responses to user questions.

## Setup

1. Make sure you have Node.js installed
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Claude API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

## Local Testing

This project provides several ways to test the Alexa skill locally:

### 1. Web Interface Testing

Run the web server:
```
npm start
```

Then open your browser to http://localhost:3000/index.html to access the web testing interface.

### 2. CLI Testing

Run the CLI tests:
```
npm test
```

You can also provide a custom question:
```
node local-test.js "What is the meaning of life?" cli
```

### 3. ASK SDK Local Debug

For more advanced testing with the ASK SDK local debugger:
```
npm run debug
```

This starts a local server on port 3001 that you can use with the Alexa Developer Console.

## Cleaning Up

To remove unnecessary files from the codebase:
```
npm run clean
```

## Deployment

To deploy to AWS Lambda:

1. Zip the contents of this directory (excluding node_modules)
2. Create a new Lambda function in AWS
3. Upload the zip file
4. Set the ANTHROPIC_API_KEY environment variable in the Lambda configuration
5. Configure an Alexa Skill trigger for the Lambda function

## Project Structure

The project follows a modern modular architecture:

```
lambda/
├── config/               # Configuration files
│   ├── claude.config.js  # Claude API configuration
│   └── environment.js    # Environment variables management
├── handlers/             # Intent handlers
│   ├── index.js          # Handler exports
│   ├── launchHandler.js  # Launch request handler
│   ├── claudeHandler.js  # Claude AI intent handler
│   ├── helpHandler.js    # Help intent handler
│   └── ...               # Other intent handlers
├── middlewares/          # Request/response interceptors
│   └── loggingMiddleware.js # Logging middleware
├── utils/                # Utility functions
│   └── errorHandler.js   # Error handling utilities
└── index.js              # Main Lambda handler
```
