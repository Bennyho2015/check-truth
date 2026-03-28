export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { image } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: '環境變數 OPENROUTER_API_KEY 未設定' });
    }

    try {
        // 注意：網址必須完整到 completions 結尾
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": `https://vercel.com`,
                "X-Title": "Zhaoyaojing",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-exp:free", // 修改這裡
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "請作為『照妖鏡』，負責仔細分析這張照片。辨識圖中內容，判斷其真偽、特徵或隱藏信息，並以清晰的繁體中文回答。"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": `data:image/jpeg;base64,${image}`
                                }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('OpenRouter Error:', data.error);
            return res.status(500).json({ error: data.error.message || 'AI 伺服器回傳錯誤' });
        }

        if (data.choices && data.choices.length > 0) {
            // 這裡修正為 choices[0]
            const resultText = data.choices[0].message.content;
            res.status(200).json({ result: resultText });
        } else {
            res.status(500).json({ error: 'AI 未能生成回應' });
        }

    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ error: '後端運作異常：' + error.message });
    }
}
