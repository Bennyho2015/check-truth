export default async function handler(req, res) {
  // 強制設置為 JSON 返回，防止觸發 Vercel 的 500 頁面
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // 1. 讀取密鑰（嘗試多種讀取方式）
  const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!API_KEY) {
    return res.status(200).json({ result: "<div style='color:red;'>【錯誤】Vercel 沒找到 API Key，請確保已 Redeploy。</div>" });
  }

  const { image } = req.body;
  if (!image) return res.status(200).json({ result: "<div style='color:red;'>【錯誤】未接收到影像數據。</div>" });

  try {
    // 2. 處理圖片數據格式
    const base64Data = Array.isArray(image) ? (image.length > 1 ? image[1] : image[0]) : image;

    // 3. 呼叫 Google API
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
      const resultHtml = data.candidates[0].content.parts[0].text.replace(/```html|```/g, '');
      res.status(200).json({ result: resultHtml });
    } else {
      res.status(200).json({ result: "AI 暫時無法解讀，請拍清楚一點。" });
    }

  } catch (error) {
    res.status(200).json({ result: `<div style='color:red;'>【伺服器異常】: ${error.message}</div>` });
  }
}


