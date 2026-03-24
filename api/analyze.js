// api/analyze.js (加固版)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "环境变量 GEMINI_API_KEY 未配置" });
  if (!image) return res.status(400).json({ error: "未接收到图片数据" });

  try {
    // 确保处理纯 Base64 数据
    const base64Data = Array.isArray(image) ? image : image;
    
    // 使用标准的 API URL
    const url = `https://generativelanguage.googleapis.com{API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Google API 响应错误: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 无法识别内容";
    
    res.status(200).json({ result: resultText });

  } catch (error) {
    // 关键：将具体的错误原因传回前端
    res.status(500).json({ error: `连接 Google 失败: ${error.message}` });
  }
}



