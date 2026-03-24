export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // 基础检查
  if (!API_KEY) return res.status(500).json({ error: "服务器未配置 API_KEY" });
  if (!image) return res.status(400).json({ error: "未接收到图片数据" });

  try {
    // 确保拿到的是纯 Base64 字符串（处理前端传来的数组或字符串）
    const base64Data = Array.isArray(image) ? image[1] : image;

    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "你是一个事实核查专家。请分析图片中文字的真伪。直接输出 HTML 格式回复，不要包含 Markdown 符号。严重错误用 <div class='fact-box fact-red'>，误导用 <div class='fact-box fact-yellow'>，真实用 <div class='fact-box fact-green'>。请简明扼要。" },
            { inline_data: { mime_type: "image/jpeg", "data": base64Data } }
          ]
        }]
      })
    });

    const data = await response.json();

    // 错误处理
    if (data.error) {
      return res.status(500).json({ error: `Google API 错误: ${data.error.message}` });
    }

    // 提取 AI 生成的文本
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 暂时无法识别此内容，请尝试更清晰的角度。";
    
    res.status(200).json({ result: resultText });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: `服务器处理异常: ${error.message}` });
  }
}


