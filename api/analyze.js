// api/analyze.js
export default async function handler(req, res) {
  // 1. 強制設置返回格式為 JSON
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  // 嘗試讀取密鑰，如果讀不到就報錯
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(200).json({ result: "<div style='color:red; background:white; padding:10px;'>【關鍵錯誤】Vercel 沒找到您的 API Key。請確保在 Vercel Settings 設置了 GEMINI_API_KEY 並點擊了 Redeploy。</div>" });
  }

  try {
    // 2. 獲取純淨 Base64
    const cleanBase64 = Array.isArray(image) ? (image.length > 1 ? image : image) : image;

    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    const data = await response.json();

    // 3. 捕捉 Google 的具體錯誤
    if (data.error) {
        return res.status(200).json({ result: `<div style='color:red; background:white; padding:10px;'>【Google 報錯】: ${data.error.message}</div>` });
    }

    if (data.candidates && data.candidates.content.parts.text) {
        let resultHtml = data.candidates.content.parts.text;
        // 去掉 AI 可能會自動加上的 ```html 標籤
        resultHtml = resultHtml.replace(/```html|```/g, '');
        res.status(200).json({ result: resultHtml });
    } else {
        res.status(200).json({ result: "AI 暫時無法生成分析，請拍得更清楚。" });
    }
  } catch (error) {
    res.status(200).json({ result: `<div style='color:red; background:white; padding:10px;'>【後端異常】: ${error.message}</div>` });
  }
}






