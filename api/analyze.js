export default async function handler(req, res) {
  // 设置跨域头，确保手机端能正常访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '请使用 POST 方法' });
  }

  const { image } = req.body;
  // 确保你 Vercel 的环境变量里填的是這個名字
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

    // 检查 AI 是否返回了正确内容
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      console.error('AI 返回异常:', JSON.stringify(data));
      res.status(500).json({ error: 'AI 没能识别出结果，请换张清晰的照片试试。' });
    }

  } catch (error) {
    console.error('API 错误:', error);
    res.status(500).json({ error: "连接 AI 失败，请检查网络或 Vercel 地区设置。" });
  }
}
