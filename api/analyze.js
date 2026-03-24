// api/analyze.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY; // 从系统变量读取，更安全

  const prompt = `你是一个严谨的事实核查专家。请分析图片中文字的真伪。
  回复要求：使用 HTML 格式。
  严重错误用：<div class="fact-box fact-red"><strong>【警告】</strong>...</div>
  误导用：<div class="fact-box fact-yellow"><strong>【警惕】</strong>...</div>
  真实用：<div class="fact-box fact-green"><strong>【可信】</strong>...</div>`;

  try {
    const response = await fetch(\`https://generativelanguage.googleapis.com\${API_KEY}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: image } }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    res.status(200).json({ result: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
