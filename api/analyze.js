const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // 设置跨域，防止报错
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') return res.status(200).json({ result: "请使用拍照功能" });

  try {
    const { image } = req.body;
    if (!image) return res.status(200).json({ error: "没收到图片，请重拍" });

    // 1. 初始化 Google AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. 发送图片给 AI
    const prompt = "你是一个真相查核助手。请分析图中文字，识别关键陈述，并以 HTML 表格形式输出：【原文】、【真实性】（真/假/误导）、【查证理由】。只返回 <table> 标签内容。";
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: "image/jpeg" } }
    ]);

    const response = await result.response;
    res.status(200).json({ result: response.text() });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI 思考出错了: " + error.message });
  }
};


















