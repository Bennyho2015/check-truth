// api/analyze.js
export default async function handler(req, res) {
  // 设置跨域头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') return res.status(200).json({ result: "请拍照" });

  try {
    const { image } = req.body;
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "API Key 未配置" });

    // 直接通过 fetch 访问 Google API，避开 Vercel 库的地区限制检测
    const url = `https://generativelanguage.googleapis.com{apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    const data = await response.json();
    
    // 解析返回的数据
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ result: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: "AI 返回异常: " + JSON.stringify(data) });
    }

  } catch (error) {
    res.status(500).json({ error: "连接失败: " + error.message });
  }
}



















