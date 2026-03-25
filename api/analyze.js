export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // 這裡的指令決定了表格的格式
  const prompt = `你是一個文稿核查專家「照妖鏡」。請分析圖片中的文字內容真偽。
    要求：
    1. 輸出一個 HTML 表格 (<table>)，包含三欄：
       - 第一欄：【原文片段】
       - 第二欄：【AI 簡要評議】
       - 第三欄：【詳細理據】
    2. 顏色標註：
       - 嚴重偽造內容背景設為 #ffebee (淡紅)
       - 誇張誤導內容背景設為 #fef7e0 (淡黃)
       - 真實內容背景設為 #e6f4ea (淡綠)
    3. 只輸出 <table> 標籤內容，不要 Markdown 符號，不要解釋，直接輸出表格。`;

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



