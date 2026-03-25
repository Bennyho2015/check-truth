// api/analyze.js
export default async function handler(req, res) {
  // 強制返回 JSON 格式
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(200).json({ result: "<div style='color:red;'>【錯誤】Vercel 沒找到您的 API Key。</div>" });
  if (!image) return res.status(200).json({ result: "<div style='color:red;'>【錯誤】圖片傳輸中斷。</div>" });

  try {
    // 確保處理純 Base64
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
        return res.status(200).json({ result: `<div style='color:red;'>【Google 報錯】: ${data.error.message}</div>` });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
        let resultHtml = data.candidates[0].content.parts[0].text.replace(/```html|```/g, '');
        res.status(200).json({ result: resultHtml });
    } else {
        res.status(200).json({ result: "AI 暫時無法分析，請試著拍清楚一點。" });
    }

  } catch (error) {
    // 捕獲異常並返回
    res.status(200).json({ result: `<div style='color:red;'>【伺服器異常】: ${error.message}</div>` });
  }
}

