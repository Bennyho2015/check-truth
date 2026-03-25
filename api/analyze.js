// api/analyze.js (最終加固診斷版)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(200).json({ result: "<div style='color:red;'>【錯誤】Vercel 沒找到 API Key，請檢查環境變量設置。</div>" });

  try {
    // 確保數據格式正確
    const base64Data = Array.isArray(image) ? (image.length > 1 ? image : image) : image;

    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    const data = await response.json();

    // 捕捉 Google 的具體錯誤並吐回給手機
    if (data.error) {
        return res.status(200).json({ result: `<div style='color:red;'>【Google API 報錯】: ${data.error.message}</div>` });
    }

    if (data.candidates && data.candidates.content.parts.text) {
        let resultHtml = data.candidates.content.parts.text.replace(/```html|```/g, '');
        res.status(200).json({ result: resultHtml });
    } else {
        res.status(200).json({ result: "AI 暫時無法生成分析，請拍得更清楚一些。" });
    }

  } catch (error) {
    res.status(200).json({ result: `<div style='color:red;'>【後端連線異常】: ${error.message}</div>` });
  }
}









