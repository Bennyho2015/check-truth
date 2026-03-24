// api/analyze.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // 核心修复：后端不需要再次 split，因为前端已经处理过了
  // 确保传给 Google 的是纯 base64 字符串
  const base64Image = Array.isArray(image) ? image[1] : image;

  const prompt = `你是一个严谨的事实核查专家。请分析图片中文字的真伪。
  回复要求：直接输出 HTML 格式，不要包含 Markdown 符号。
  严重错误用：<div class="fact-box fact-red"><strong>【警告】</strong>...</div>
  误导用：<div class="fact-box fact-yellow"><strong>【警惕】</strong>...</div>
  真实用：<div class="fact-box fact-green"><strong>【可信】</strong>...</div>`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    const data = await response.json();
    
    // 如果 Google 返回错误，捕获它
    if (data.error) {
        return res.status(500).json({ error: `Google API Error: ${data.error.message}` });
    }

    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
        return res.status(500).json({ error: "AI 未能生成有效的分析结果，请尝试清晰拍摄文字。" });
    }

    const resultText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ result: resultText });
    
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "服务器内部错误，请检查 Vercel Logs" });
  }
}
