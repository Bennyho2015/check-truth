const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 暴力锁死命令开始 ---
export const config = {
  regions: ['iad1'], // 强制华盛顿节点
};
// --- 暴力锁死命令结束 ---

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') return res.status(200).json({ result: "请拍照" });

  try {
    const { image } = req.body;
    if (!image) return res.status(200).json({ error: "没收到图片" });

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "你是一个真相查核助手。请分析图中文字，识别关键陈述，并以 HTML 表格形式输出：【原文】、【真实性】、【查证理由】。只返回 <table> 标签内容。";
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: "image/jpeg" } }
    ]);

    const text = await result.response.text();
    res.status(200).json({ result: text });

  } catch (error) {
    res.status(500).json({ error: "AI 报错: " + error.message });
  }
};


















