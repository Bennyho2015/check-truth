// api/analyze.js 最终稳健版
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { image } = req.body; // 此时 image 已经是纯字符串了
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!image) return res.status(400).json({ error: "未接收到图片数据" });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "你是一个事实核查专家。请分析图片中文字的真伪。请直接用 HTML 的 div 标签返回结果，class 包含 fact-box 和对应的颜色类（fact-red, fact-yellow, fact-green）。" },
            { inline_data: { mime_type: "image/jpeg", data: image } }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
        return res.status(500).json({ error: `Gemini 报错: ${data.error.message}` });
    }

    const resultText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ result: resultText });

  } catch (error) {
    res.status(500).json({ error: "服务器通讯故障，请重试。" });
  }
}

