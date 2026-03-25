export default async function handler(req, res) {
  // 1. 設置安全通行證 (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(200).json({ result: "<div style='color:red;'>【密鑰缺失】請在 Vercel 設置環境變量並 Redeploy。</div>" });

  try {
    // 2. 獲取純淨 Base64
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
    if (data.error) return res.status(200).json({ result: `<div style='color:red;'>【Google 報錯】: ${data.error.message}</div>` });

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const resultHtml = data.candidates[0].content.parts[0].text.replace(/```html|```/g, '');
      res.status(200).json({ result: resultHtml });
    } else {
      res.status(200).json({ result: "AI 暫時無法生成分析，請拍得更清楚。" });
    }
  } catch (error) {
    res.status(200).json({ result: `<div style='color:red;'>【後端異常】: ${error.message}</div>` });
  }
}



