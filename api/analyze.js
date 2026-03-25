// api/analyze.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(200).json({ result: "【錯誤】未找到 API Key，請在 Vercel 設置。" });
  if (!image) return res.status(200).json({ result: "【錯誤】未接收到有效影像。" });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:
        }]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(200).json({ result: "Google 報錯: " + data.error.message });
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
        let resultHtml = data.candidates[0].content.parts[0].text.replace(/```html|```/g, '');
        res.status(200).json({ result: resultHtml });
    } else {
        res.status(200).json({ result: "AI 暫時無法生成分析報告。" });
    }
  } catch (error) {
    res.status(200).json({ result: "後端異常：" + error.message });
  }
}
