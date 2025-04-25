import fetch from 'node-fetch';
import { getApiKey, getDefaultModel } from './config.js';

export async function generateCommand(userInput, overrideKey = null, modelName = null) {
  const apiKey = await getApiKey(overrideKey);
  const selectedModel = modelName || getDefaultModel();

  const prompt = `
You are a Linux command-line expert. Convert the following natural language request into a safe and accurate shell command. Return ONLY the shell command — no explanation.

Request: ${userInput}
  `.trim();

  let response;

  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: 'You are a helpful Linux command assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Handle empty/malformed response
    const output = data.choices?.[0]?.message?.content?.trim();
    return output || 'echo "No command returned by model."';

  } catch (err) {
    console.error(`❌ Failed to get response from model "${selectedModel}"`);
    console.error(`→ ${err.message}`);

    if (selectedModel !== 'mistralai/mistral-7b-instruct') {
      console.log('⚠️ Falling back to default model: mistralai/mistral-7b-instruct\n');
      return await generateCommand(userInput, overrideKey, 'mistralai/mistral-7b-instruct');
    } else {
      return 'echo "Unable to generate command. Check API key or model."';
    }
  }
}

export async function explainCommand(shellCommand, overrideKey = null, modelName = null) {
    const apiKey = await getApiKey(overrideKey);
    const selectedModel = modelName || getDefaultModel();
  
    const prompt = `
  Explain the following shell command in simple terms, step by step:
  
  ${shellCommand}
    `.trim();
  
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: 'You are a linux command-line assistant who explains commands clearly and concisely.' },
            { role: 'user', content: prompt }
          ]
        })
      });
  
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || 'No explanation available.';
  
    } catch (err) {
      return `❌ Error while explaining: ${err.message}`;
    }
  }
  
