# Alexa Claude AI Skill

This is an Alexa skill that integrates with Claude AI to provide intelligent responses to user questions.

## Setup Instructions

1. Create an Anthropic account and get an API key from https://console.anthropic.com/

2. Create an Amazon Developer account and set up a new Alexa skill:
   - Go to https://developer.amazon.com/alexa/console/ask
   - Click "Create Skill"
   - Name your skill (e.g., "Claude Assistant")
   - Choose "Custom" model
   - Select "Alexa-hosted (Node.js)" as your hosting method

3. Set up the skill:
   - Upload the interaction model from `models/en-US.json` to the Alexa Developer Console
   - Deploy the Lambda function code
   - Add your Anthropic API key as an environment variable in Lambda (name: `ANTHROPIC_API_KEY`)

4. Install dependencies:
   ```bash
   cd lambda
   npm install
   ```

## Testing the Skill

You can test the skill by saying:
- "Alexa, open claude assistant"
- "Ask claude assistant what is quantum computing"
- "Ask claude assistant how to make pancakes"

## Features

- Natural language interaction with Claude AI
- Handles various types of questions and queries
- Error handling and recovery
- Help and stop intents

## Dependencies

- ask-sdk-core: Alexa Skills Kit SDK for Node.js
- @anthropic-ai/sdk: Claude AI SDK
