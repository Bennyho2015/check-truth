export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(200).json({ result: "【錯誤】Vercel 沒找到 API Key，請檢查環境變量設置。" });

  try {
    const url = `https://generativelanguage.googleapis.com{API_KEY}`;
    
    // 確保傳給 Google 的是純 Base64 字串
    const pureBase64 = Array.isArray(image) ? (image.length > 1 ? image[1] : image[0]) : image;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });

    const data = await response.json();

    // 如果 Google 報錯，把具體原因吐給手機
    if (data.error) {
      return res.status(200).json({ result: `【Google 報錯】: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const resultHtml = data.candidates[0].content.parts[0].text.replace(/```html|```/g, '');
      res.status(200).json({ result: resultHtml });
    } else {
      res.status(200).json({ result: "AI 暫時無法解讀影像，請試著拍更清楚一點。" });
    }

  } catch (error) {
    res.status(200).json({ result: `【後端異常】: ${error.message}` });
  }
}








