export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "伺服器未配置 API_KEY" });
  if (!image) return res.status(400).json({ error: "未接收到影像數據" });

  try {
    // 這裡直接接收前端傳來的純 Base64 字串
    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    if (data.candidates && data.candidates[0].content.parts[0].text) {
        let resultHtml = data.candidates[0].content.parts[0].text;
        resultHtml = resultHtml.replace(/```html|```/g, ''); // 清理多餘標籤
        res.status(200).json({ result: resultHtml });
    } else {
        res.status(500).json({ error: "AI 暫時無法分析此內容，請試著拍清楚一點" });
    }
  } catch (error) {
    res.status(500).json({ error: `後端異常：${error.message}` });
  }
}






