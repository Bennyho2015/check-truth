export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(200).json({ result: "【錯誤】伺服器未找到 API Key" });

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
    res.status(200).json({ result: data.candidates[0].content.parts[0].text.replace(/```html|```/g, '') });
  } catch (error) {
    res.status(200).json({ result: "分析出錯：" + error.message });
  }
}

