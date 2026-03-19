import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { filterProducts } from "@/lib/filterProducts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type GeminiMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

export async function POST(req: NextRequest) {
  try {
    const { messages, userState } = (await req.json()) as {
      messages: { role: string; text: string }[];
      userState: { step: number; age: string; budget: number; concerns: string[] };
    };

    const step = userState?.step ?? 1;

    // 履歴トリム：ヒアリング中は直近3ターン、提案以降は5ターン
    const maxTurns = step >= 7 ? 5 : 3;
    const trimmed = messages.slice(-(maxTurns * 2));

    if (!trimmed.length) throw new Error("No messages provided");

    // Gemini形式に変換
    const history: GeminiMessage[] = trimmed.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));
    const lastUserMessage = trimmed.at(-1)!.text;

    // 提案フェーズのみ商品リストを追加
    let systemPrompt = SYSTEM_PROMPT;
    if (step >= 7 && userState.age && userState.budget && userState.concerns.length > 0) {
      const filtered = filterProducts(userState.age, userState.budget, userState.concerns);
      const productList = filtered
        .map((p) => `${p.name}(${p.step})¥${p.price.toLocaleString()}`)
        .join(" / ");
      systemPrompt += `\n\n【今回提案可能な商品】\n${productList}`;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastUserMessage);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            controller.enqueue(new TextEncoder().encode(chunk.text()));
          }
        } catch {
          controller.enqueue(new TextEncoder().encode("申し訳ありません。もう一度お試しください。"));
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const fallback = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("うまく受け取れませんでした。もう一度教えていただけますか？"));
        controller.close();
      },
    });
    return new NextResponse(fallback, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
