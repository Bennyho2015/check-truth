export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "伺服器未配置 API_KEY" });
  if (!image) return res.status(400).json({ error: "未接收到影像數據" });

  try {
    // 核心修復：確保拿到的是純 Base64 字串（去掉可能存在的數組包裹）
    const cleanBase64 = Array.isArray(image) ? (image.length > 1 ? image[1] : image[0]) : image;

    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
        return res.status(500).json({ error: `Google API 錯誤: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
        let resultHtml = data.candidates[0].content.parts[0].text;
        // 去掉 AI 可能會自動加上的 ```html 標籤
        resultHtml = resultHtml.replace(/```html|```/g, '');
        res.status(200).json({ result: resultHtml });
    } else {
        res.status(500).json({ error: "AI 暫時無法分析此內容，請試著拍清楚一點" });
    }

  } catch (error) {
    res.status(500).json({ error: `後端異常：${error.message}` });
  }
}




