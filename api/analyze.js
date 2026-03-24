// api/analyze.js (全面加固版)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "服务器未配置 API_KEY，请检查 Vercel 环境变量设置。" });
  if (!image) return res.status(400).json({ error: "未接收到图片数据。" });

  try {
    // 核心修复：多重判定，确保提取出纯净的 Base64 字符串
    let cleanBase64 = "";
    if (Array.isArray(image)) {
        // 如果是数组，取第二部分
        cleanBase64 = image.length > 1 ? image[1] : image[0];
    } else if (typeof image === 'string') {
        // 如果是带前缀的字符串，切掉前缀
        cleanBase64 = image.includes(',') ? image.split(',')[1] : image;
    }

    // 去掉可能的换行符或空格
    cleanBase64 = cleanBase64.trim();

    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "你是一个事实核查专家。请分析图片中文字的真伪，识别虚假、夸张或煽情内容。请直接用 HTML 的 div 标签返回结果，样式包含 fact-box 和对应的颜色类（fact-red, fact-yellow, fact-green）。" },
            { inline_data: { mime_type: "image/jpeg", data: cleanBase64 } }
          ]
        }]
      })
    });

    const data = await response.json();
    
    // 捕获 Google API 内部的详细报错
    if (data.error) {
        console.error("Google API Error:", data.error.message);
        return res.status(500).json({ error: `Google API 报错: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
        res.status(200).json({ result: data.candidates[0].content.parts[0].text });
    } else {
        res.status(500).json({ error: "Gemini 未能生成结果，可能是图片内容无法识别，请重试。" });
    }

  } catch (error) {
    console.error("Backend Catch Error:", error);
    res.status(500).json({ error: `服务器通讯故障: ${error.message}` });
  }
}

