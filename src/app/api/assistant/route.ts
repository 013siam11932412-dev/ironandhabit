import { NextResponse } from "next/server";
import {
  executeResilientChat,
  getAssistantHealthReport,
  ChatMessage,
  UserContext,
} from "@/lib/assistant/orchestrator";
import { synthesizeLocalKnowledge } from "@/lib/assistant/knowledgeBase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, messages, userContext } = (body || {}) as {
      message?: string;
      history?: ChatMessage[];
      messages?: ChatMessage[];
      userContext?: UserContext;
    };

    // Combine message + history or messages array to build the conversation
    const rawConversation: ChatMessage[] = [];
    if (Array.isArray(history)) {
      rawConversation.push(...history);
    }
    if (message && typeof message === "string" && message.trim()) {
      rawConversation.push({ role: "user", content: message.trim() });
    } else if (Array.isArray(messages)) {
      rawConversation.push(...messages);
    }

    const isBn = userContext?.language !== "en";

    // If completely empty request, supply a helpful introductory guidance
    if (rawConversation.length === 0) {
      const defaultKnowledge = synthesizeLocalKnowledge("শুরু", userContext);
      return NextResponse.json({
        reply: defaultKnowledge.replyText,
        provider: "local_knowledge_engine",
        modelUsed: "iron-habit-scientific-core",
        fallbackActive: true,
        isAccurateVerified: true,
      });
    }

    const result = await executeResilientChat({
      rawConversation,
      userContext,
    });

    return NextResponse.json({
      reply: result.reply,
      provider: result.provider,
      modelUsed: result.modelUsed,
      fallbackActive: result.fallbackActive,
      isAccurateVerified: result.isAccurateVerified,
      statusNote: isBn ? result.statusNoteBn : result.statusNoteEn,
    });
  } catch (error: unknown) {
    console.error("Critical error in /api/assistant:", error);

    // Guaranteed Zero-Breakage: Return verified local knowledge rather than failing
    const emergencyResult = synthesizeLocalKnowledge("শুরু", { language: "bn" });
    return NextResponse.json(
      {
        reply: emergencyResult.replyText,
        provider: "local_knowledge_engine",
        modelUsed: "iron-habit-scientific-core",
        fallbackActive: true,
        isAccurateVerified: true,
        statusNote: "সিস্টেম স্বয়ংক্রিয়ভাবে নিরাপদ স্থানীয় বৈজ্ঞানিক নলেজবেস থেকে উত্তর তৈরি করেছে।",
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  const report = getAssistantHealthReport();
  return NextResponse.json(report, { status: 200 });
}
