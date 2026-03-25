export default async function handler(req, res) {
  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "請分析圖中文字真偽。直接輸出一個三欄表格：原文、簡評、理據。嚴重錯誤背景設為紅(#ffebee)，誤導黃(#fef7e0)，正確綠(#e6f4ea)。" }, { inline_data: { mime_type: "image/jpeg", data: image } }] }]
      })
    });
    const data = await response.json();
    res.status(200).json({ result: data.candidates[0].content.parts[0].text.replace(/```html|```/g, '') });
  } catch (error) { res.status(500).json({ error: "分析出錯，請檢查 API Key" }); }
}







