// 强制声明使用 Node.js 运行时，避开 Edge Runtime 导致的香港 IP 锁定
export const config = {
  runtime: 'nodejs', 
};

export default async function handler(req, res) {
  // 设置跨域头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  // 注意：确保你的 Vercel 环境变量里填的是这个名字
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
    
    // 提取并返回 AI 的查验报告
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: 'AI 识别失败，请确保照片清晰' });
    }
  } catch (error) {
    res.status(500).json({ error: '连接失败，请检查 API Key 或网络' });
  }
}
