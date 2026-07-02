import { GoogleGenAI } from "@google/genai";
import opportunities from "../../data/opportunities";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function buildContext() {
  return opportunities
    .map(
      (opp) =>
        `[${opp.id}] ${opp.title}\nالنوع: ${opp.type} | الدولة: ${opp.country} | الموعد النهائي: ${opp.deadline}\nالتمويل: ${opp.funding} | المجال: ${opp.field}\nالشروط: ${opp.eligibility}\nالوصف: ${opp.description}`
    )
    .join("\n\n---\n\n");
}

const SYSTEM_PROMPT = `أنت مساعد منصة "فرص خضراء" (Foras Khadra). وظيفتك مساعدة المستخدمين في إيجاد الفرص المناسبة لهم من قاعدة بيانات الفرص المتاحة.

قواعد مهمة:
- أجب دائماً باللغة العربية
- استند فقط إلى الفرص الموجودة في قاعدة البيانات أدناه
- إذا سأل المستخدم عن شيء غير موجود في البيانات، أخبره بذلك بوضوح
- كن مختصراً ومفيداً في ردودك
- عند ذكر فرصة، اذكر اسمها والدولة والموعد النهائي
- يمكنك الرد على التحيات والأسئلة العامة عن المنصة

قاعدة بيانات الفرص المتاحة:

${buildContext()}`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    const chatHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        ...chatHistory,
        { role: "user", parts: [{ text: lastMessage }] },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const text = response.text;

    return Response.json({ message: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      { error: "حدث خطأ في معالجة طلبك. تأكد من صحة مفتاح API." },
      { status: 500 }
    );
  }
}
