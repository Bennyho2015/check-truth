// api/analyze.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: '请使用 POST 请求' });

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: '未接收到图片，请重拍' });

    // 检查环境变量
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Vercel 环境变量未设置 API KEY' });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "你是一个真相查核助手。请分析图中文字，识别关键陈述，并以 HTML 表格形式输出：【原文】、【真实性】（真/假/误导）、【查证理由】。只返回 <table> 标签内容。";

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: "image/jpeg" } },
    ]);

    const text = await result.response.text();
    res.status(200).json({ result: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI 思考罢工了: " + error.message });
  }
}















