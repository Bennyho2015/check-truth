export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ result: "請使用 POST" });
  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(200).json({ result: "<div style='color:red;'>【錯誤】Vercel 未配置 API Key</div>" });

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
    if (data.error) return res.status(200).json({ result: `Google 報錯: ${data.error.message}` });
    const table = data.candidates[0].content.parts[0].text.replace(/```html|```/g, '');
    res.status(200).json({ result: table });
  } catch (error) {
    res.status(200).json({ result: `<div style='color:red;'>查察異常：${error.message}</div>` });
  }
}




