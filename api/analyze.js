export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // 這裡的指令決定了表格的格式
const prompt = "你是嚴謹的內容真偽核查專家。請分析圖像和文字，識別虛假、誇張或煽情內容。
  請直接輸出一個 HTML 表格 (<table>) 包含三欄：1.【原文片段】、2.【簡要評議】、3.【核查理據】。
  要求：嚴重錯誤背景設為紅 (#ffebee)，誤導設為黃 (#fffde7)，正確準確設為綠 (#e8f5e9)。
    直接輸出表格內容，不要 Markdown 符號。";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com{API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: image } }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const tableHtml = data.candidates[0].content.parts[0].text;
    res.status(200).json({ result: tableHtml });

  } catch (error) {
    res.status(500).json({ error: `照妖鏡暫時失靈：${error.message}` });
  }
}



