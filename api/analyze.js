import { GoogleGenerativeAI } from "@google/generative-ai";

// 强制锁死：这行代码告诉 Vercel 必须使用边缘计算，能极大增加绕过地区限制的概率
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // 强制华盛顿节点
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { image } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "请分析图中文字，识别关键陈述，并以 HTML 表格输出：【原文】、【真实性】、【理由】。只返回 <table> 标签。";
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: "image/jpeg" } }
    ]);

    const text = await result.response.text();
    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "AI 报错: " + error.message }), { status: 500 });
  }
}

















