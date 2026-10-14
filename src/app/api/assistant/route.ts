import { NextResponse } from "next/server";

interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "model";
  content: string;
}

interface UserContext {
  language?: "en" | "bn";
  bmi?: number;
  weight?: number;
  height?: number;
  goal?: string;
  waterTarget?: number;
  caloriesTarget?: number;
}

function buildSystemInstruction(userContext?: UserContext): string {
  const bioSummary = userContext
    ? `[User Real-Time Profile & Telemetry]:
- Current BMI: ${userContext.bmi ? userContext.bmi.toFixed(1) : "Not recorded yet"}
- Weight: ${userContext.weight ? `${userContext.weight} kg` : "Not recorded yet"}
- Height: ${userContext.height ? `${userContext.height} cm` : "Not recorded yet"}
- Current Focus / Category: ${userContext.goal || "General health & fitness"}
- Target Daily Calories: ${userContext.caloriesTarget || 2000} kcal
- Target Daily Hydration: ${userContext.waterTarget || 2500} ml`
    : "[No biometric profile logged yet]";

  return `You are the dynamic AI Fitness, Nutrition & Habit Mentor for "Iron & Habit" (আইরন অ্যান্ড হ্যাবিট).

${bioSummary}

PERSONA & COACHING IDENTITY:
- You are a certified, wise, empathetic, and evidence-based fitness mentor.
- You have NO topic or question restrictions: answer any query freely across fitness, strength training, calisthenics, running, home workouts, nutrition, meal planning, macro calculation, fat loss, muscle growth, recovery, mobility, sleep, injury prevention, and daily habit consistency.

CORE COACHING METHODOLOGY:
1. Socratic Questioning:
   - When users ask broad questions or ask for a workout/diet plan, NEVER dump an overwhelming, generic, multi-day gym spreadsheet on them right away.
   - First, understand their context. Ask 1 or 2 gentle, thoughtful follow-up questions to assess their current fitness level, past injuries/chronic pain, daily schedule/time availability, equipment access (home vs gym), and dietary preferences.
   - When the user asks a specific or tactical question (e.g. "How much protein in 100g chicken?", "What is progressive overload?"), provide the clear, direct scientific answer immediately.

2. Simple Everyday Analogies:
   - Demystify technical fitness and metabolic concepts using simple, everyday analogies:
     • Caloric Deficit / Surplus: Compare food energy to a phone battery or a car's fuel tank (eating slightly less safely uses your battery reserve; severe starvation triggers low-power throttling).
     • Progressive Overload: Compare to leveling up in a game or learning guitar chords (start with fundamentals, then gradually add 1% difficulty).
     • Muscle Recovery & Sleep: Compare muscles to road repair or nightly phone software updates (training is the signal; deep sleep is the actual construction).
     • Habit Consistency: Compare to brushing teeth or keeping water boiling (daily low-effort maintenance beats sporadic exhausting efforts).

3. Warmth, Encouragement & Beginner-First Empathy:
   - Always be exceptionally warm, welcoming, and encouraging, especially to beginners or individuals who have never worked out before or feel out of shape.
   - Dissolve fitness guilt and intimidation. Praise their decision to show up.
   - Recommend frictionless 5–10 minute starter micro-habits to build early confidence.

4. Scientific Accuracy & Safety:
   - Ground all recommendations in exercise physiology and metabolic thermodynamics.
   - Reject unscientific fitness myths (spot reduction of belly fat is biologically impossible; starvation crash diets harm health).
   - If a user mentions sharp joint pain, chronic injuries, or medical conditions, kindly advise consulting a physician or physical therapist.

5. Language & Formatting:
   - Respond in the language used by the user (Bengali if written in Bengali / language is 'bn'; English if written in English / language is 'en').
   - Use clean, well-formatted Markdown with bold headers, neat bullet points, and concise, readable paragraphs.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, messages, userContext } = body as {
      message?: string;
      history?: ChatMessage[];
      messages?: ChatMessage[];
      userContext?: UserContext;
    };

    // Combine message + history or messages array to build the full conversation
    const rawConversation: ChatMessage[] = [];
    if (Array.isArray(history)) {
      rawConversation.push(...history);
    }
    if (message && typeof message === "string" && message.trim()) {
      rawConversation.push({ role: "user", content: message.trim() });
    } else if (Array.isArray(messages)) {
      rawConversation.push(...messages);
    }

    if (rawConversation.length === 0) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "A user message or conversation history is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isBn = userContext?.language === "bn";

    // If Gemini API Key is missing, alert the user with setup instructions
    if (!apiKey) {
      return NextResponse.json({
        reply: isBn
          ? "⚠️ **Gemini API Key সংযুক্ত নেই।**\n\nGoogle Gemini AI এজেন্টের সাথে সরাসরি যুক্ত হতে অনুগ্রহ করে আপনার `.env.local` ফাইলে `GEMINI_API_KEY=your_api_key_here` সেট করুন এবং সার্ভার রিস্টার্ট করুন।\n\n*(Google AI Studio থেকে সহজেই একটি ফ্রি API Key তৈরি করতে পারেন।)*"
          : "⚠️ **Gemini API Key is not configured.**\n\nTo connect dynamically with Google Gemini AI, please add `GEMINI_API_KEY=your_api_key_here` to your `.env.local` file and restart your server.\n\n*(You can generate a free key from Google AI Studio at https://aistudio.google.com)*",
        isMissingKey: true,
      });
    }

    const systemInstructionText = buildSystemInstruction(userContext);

    // Format conversation history for Gemini REST API (v1beta)
    // Ensures valid alternating user/model roles and removes leading model greeting
    const formattedContents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];

    for (const msg of rawConversation) {
      if (!msg.content || !msg.content.trim()) continue;

      const role: "user" | "model" =
        msg.role === "assistant" || msg.role === "model" ? "model" : "user";

      // Gemini contents cannot start with a model message
      if (formattedContents.length === 0 && role === "model") {
        continue;
      }

      // Merge sequential messages of the same role to maintain strict alternation
      if (
        formattedContents.length > 0 &&
        formattedContents[formattedContents.length - 1].role === role
      ) {
        formattedContents[formattedContents.length - 1].parts[0].text +=
          `\n\n${msg.content}`;
      } else {
        formattedContents.push({
          role,
          parts: [{ text: msg.content }],
        });
      }
    }

    if (formattedContents.length === 0) {
      return NextResponse.json(
        { error: "EMPTY_HISTORY", message: "No valid user messages found." },
        { status: 400 }
      );
    }

    const requestPayload = {
      system_instruction: {
        parts: [{ text: systemInstructionText }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
      },
    };

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-3.8-flash",
    ];
    let lastError: string | null = null;
    let replyText: string | null = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidateText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            replyText = candidateText;
            break;
          }
        } else {
          const errData = await geminiRes.text();
          lastError = `[${geminiRes.status}] ${errData}`;
          if (geminiRes.status === 404) {
            continue;
          }
          if (geminiRes.status === 400 || geminiRes.status === 403) {
            break;
          }
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (!replyText) {
      console.error("Gemini API call failed:", lastError);
      return NextResponse.json({
        reply: isBn
          ? `⚠️ **Gemini AI সংযোগে সমস্যা হয়েছে:**\n\n${lastError || "অনুরোধ প্রক্রিয়া করতে ব্যর্থ হয়েছে।"}\n\nঅনুগ্রহ করে আপনার \`GEMINI_API_KEY\` এবং ইন্টারনেট সংযোগ যাচাই করুন।`
          : `⚠️ **Gemini AI Connection Error:**\n\n${lastError || "Failed to process request."}\n\nPlease verify your \`GEMINI_API_KEY\` and network connection.`,
        error: lastError,
      });
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: unknown) {
    console.error("Assistant route error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error occurred.";
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
