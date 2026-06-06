const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const Bottleneck = require('bottleneck');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load env from server/.env or project-root .env when running standalone scripts.
const envCandidates = [
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', '..', '.env')
];
for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

let client = null;
if (endpoint && apiKey) {
  try {
    client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
  } catch (e) {
    console.error('Failed to initialize OpenAI client:', e && e.message ? e.message : e);
    client = null;
  }
}

const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 250 });

async function chat(messages, maxTokens = Number(process.env.AZURE_OPENAI_MAX_TOKENS || 1024)) {
  // If client unavailable, return a safe stub JSON for offline testing
  if (!client || !deployment) {
    const stub = JSON.stringify({
      atsScore: 75,
      keywordsFound: ['JavaScript','React','Node.js'],
      missingKeywords: ['TypeScript','Docker'],
      suggestions: ['Add TypeScript projects','Include Dockerfile'],
      summary: 'Stubbed analysis: ensure Azure keys are set to enable real analysis.'
    });
    return stub;
  }

  return limiter.schedule(async () => {
    const res = await client.getChatCompletions(deployment, { messages, maxTokens });
    const choice = res.choices && res.choices[0];
    return choice ? choice.message.content : null;
  });
}

module.exports = { chat };
