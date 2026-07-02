import Groq from "groq-sdk";
import opportunities from "../../data/opportunities";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

    // Format messages for Groq API
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }))
    ];

    const response = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "llama3-8b-8192", // Fast and free Llama 3 model
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = response.choices[0]?.message?.content || "";

    return Response.json({ message: text });
  } catch (error) {
    console.error("Groq API error:", error);
    return Response.json(
      { error: "حدث خطأ في معالجة طلبك. تأكد من صحة مفتاح API." },
      { status: 500 }
    );
  }
}
