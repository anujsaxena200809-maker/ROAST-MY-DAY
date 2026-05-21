export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { day } = req.body;

  if (!day || day.trim().length < 10) {
    return res.status(400).json({ error: 'Tell me more about your day!' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `You are a savage but lovable roast comedian. Roast the person's day in a hilariously brutal way. Be funny, sarcastic, and creative. Use specific details from what they shared. Keep it under 150 words. End with one surprisingly wholesome sentence. No emojis in the roast itself.\n\nTheir day: ${day}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error');
    const roast = data.content[0].text;
    return res.status(200).json({ roast });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to roast your day.' });
  }
} 
