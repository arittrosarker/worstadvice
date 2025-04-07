// api/openrouter.js

export default async function handler(req, res) {
  // Only allow POST requests.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Use your secure environment variable for the API key.
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        max_tokens: 60,
        messages: [
          {
            role: 'system',
            content: "You are a terrible advice giver. Respond with the worst, most sarcastic, and hilariously unhelpful advice. Write EXACTLY two lines, each line no more than 15 words. Keep it snappy, absurd, and loosely related."
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
