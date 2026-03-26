const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') return res.status(200).json({ result: "请拍照后点击查核" });

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "没收到图片数据" });

    // 1. 初始化 AI
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("API Key 未配置");

    const genAI = new GoogleGenerativeAI(apiKey);
    // 使用 flash 模型，速度最快且不容易超时
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. 发送请求
    const prompt = "请分析图中文字，识别关键陈述，并以 HTML 表格输出：【原文】、【真实性】、【理由】。只返回 <table> 标签。";
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: "image/jpeg" } }
    ]);

    const response = await result.response;
    res.status(200).json({ result: response.text() });

  } catch (error) {
    console.error(error);
    // 把具体错误传回屏幕，方便我们调试
    res.status(500).json({ error: "AI 报错: " + error.message });
  }
};

















