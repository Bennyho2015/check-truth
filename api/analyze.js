// api/analyze.js
export default async function handler(req, res) {
  // 设置跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') return res.status(200).json({ result: "请拍照" });

  try {
    const { image } = req.body;
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // 直接通过原始 URL 请求 Google，这种方式最难被拦截
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
    
    // 如果 AI 成功返回了文字
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ result: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: "AI 暂时无法解析: " + JSON.stringify(data) });
    }

  } catch (error) {
    res.status(500).json({ error: "服务器通讯失败: " + error.message });
  }
}




















