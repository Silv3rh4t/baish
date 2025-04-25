import { getApiKey } from './clai.js'; // Or move to a shared util

export async function generateCommand(userInput) {
  const apiKey = await getApiKey();

  const prompt = `
You are an expert command-line assistant. Convert the following natural language request into a safe and accurate Linux terminal command. Return only the command and nothing else.

Request: ${userInput}
`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'You are a Linux command generator.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content.trim() || 'echo "No output."';
}
