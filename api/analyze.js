export default async function handler(req, res) {
  // 处理跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com{apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    const data = await response.json();
    
    // 关键：将 AI 的回答提取出来返回给前端
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: 'AI 识别失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '连接失败，请检查地区设置' });
  }
}
