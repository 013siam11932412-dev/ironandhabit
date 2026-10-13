import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface UserContext {
  bmi?: number | null;
  bmiCategory?: string;
  weight?: number | string;
  height?: number | string;
  calorieTarget?: number;
  workoutLogs?: Array<{
    exercise_name?: string;
    set_number?: number;
    reps?: number;
    weight?: number;
    completed?: boolean;
  }>;
  nutritionLogs?: Array<{
    meal_name?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }>;
  language?: "en" | "bn";
}

function buildSystemInstruction(userContext?: UserContext): string {
  const lang = userContext?.language || "en";
  const weight = userContext?.weight ? `${userContext.weight} kg` : "Not provided";
  const height = userContext?.height ? `${userContext.height} cm` : "Not provided";
  const bmi = userContext?.bmi
    ? `${userContext.bmi}${userContext?.bmiCategory ? ` (${userContext.bmiCategory})` : ""}`
    : "Not calculated";
  const calorieTarget = userContext?.calorieTarget
    ? `${userContext.calorieTarget} kcal`
    : "Not configured";

  const workoutSummary =
    Array.isArray(userContext?.workoutLogs) && userContext.workoutLogs.length > 0
      ? userContext.workoutLogs
          .slice(-10)
          .map(
            (w) =>
              `• ${w.exercise_name || "Exercise"}: Set ${w.set_number || 1} — ${w.weight || 0}kg x ${w.reps || 0} reps [${w.completed ? "Completed" : "Logged"}]`
          )
          .join("\n")
      : "No exercises logged today yet.";

  const nutritionSummary =
    Array.isArray(userContext?.nutritionLogs) && userContext.nutritionLogs.length > 0
      ? userContext.nutritionLogs
          .slice(-10)
          .map(
            (n) =>
              `• ${n.meal_name || "Meal"}: ${n.calories || 0} kcal (P: ${n.protein || 0}g | C: ${n.carbs || 0}g | F: ${n.fat || 0}g)`
          )
          .join("\n")
      : "No meals logged today yet.";

  return `You are the Elite AI Fitness & Nutrition Assistant for the "Iron & Habit" (আইরন অ্যান্ড হ্যাবিট) athletic training platform.
YOUR PROFESSIONAL PERSONA & CREDENTIALS:
- Certified Master Sports Scientist (CSCS), Clinical Sports Dietitian (RD), and Empathetic High-Performance Strength Coach.
- You speak with scientific authority, precision, and deep empathy for the user's personal fitness journey.

LIVE ATHLETE TELEMETRY & CONTEXT (FROM CURRENT SESSION):
• Preferred Language Mode: ${lang === "bn" ? "Bengali (বাংলা)" : "English"}
• Current Body Weight: ${weight}
• Current Height: ${height}
• Current BMI & Classification: ${bmi}
• Target Daily Caloric Intake: ${calorieTarget}
• Today's Workout Logs:
${workoutSummary}
• Today's Nutrition Logs:
${nutritionSummary}

CRITICAL OPERATING DIRECTIVES & GUARDRAILS:

1. INTERACTIVE SOCRATIC COACHING (NON-NEGOTIABLE):
- When a user asks broad, open-ended, or vague questions (e.g., "আমি ওজন কমাতে চাই", "কী ব্যায়াম করব?", "I want to get fit", "Give me a diet plan", "help me build muscle"):
  DO NOT dump an overwhelming generic wall of text or 7-day cookie-cutter routine right away!
- Acknowledge their ambition warmly and ask 2 to 3 targeted, concise clarifying questions to calibrate their physiology:
  1) Age & daily physical activity level (e.g. sedentary desk job vs. on-feet manual work).
  2) Training environment: Gym access (barbells, dumbbells, machines) vs Home / Calisthenics (bodyweight, pull-up bar).
  3) Injury or joint pain history (knees, lower back, rotator cuff).
  4) Dietary preferences, typical staples, and budget (e.g. Bangladeshi home staples like rice, dal, chicken, eggs, fish vs vegetarian).
- If the user has ALREADY provided specific details or asks a precise tactical question (e.g. "What should I eat post-workout?", "How do I calculate RPE for bench press?", "Is 100g chicken breast enough protein?"), give the exact scientific answer immediately without delay.

2. ABSOLUTE BIOLOGY & SCIENTIFIC TRUTH (ZERO MYTHS):
- Ground 100% of your recommendations in exercise physiology and metabolic thermodynamics:
  • Energy Balance (CICO): Caloric deficit for fat loss (aim for 300-500 kcal deficit; never severe crash diets), caloric surplus or maintenance for hypertrophy.
  • Progressive Overload: Mechanical tension through systematically increasing load, reps, sets, or movement quality over time.
  • Muscle Protein Synthesis (MPS): Target 1.6 to 2.2g of protein per kg of bodyweight, distributed across 3-4 protein feedings.
  • Sleep & Recovery: 7-9 hours of restorative sleep and 3-4 liters of hydration are essential for cortisol regulation and muscular recovery.
- ZERO BS RULE:
  • Firmly reject spot reduction myths (e.g. "Doing 100 crunches burns belly fat"). Explain that fat mobilization is systemic.
  • Strictly reject crash diets (<1200 kcal starvation) which cause metabolic adaptation, muscle catabolism, and hormonal down-regulation.
  • Denounce scam supplements (detox teas, fat burner pills, waist trainers). Advocate whole foods first. Creatine monohydrate (3-5g daily) and quality protein powder can be mentioned as evidence-based aids if asked.

3. BEGINNER-FRIENDLY CLARITY:
- Whenever introducing technical fitness or nutrition terms, demystify them with a quick 1-sentence plain-language explanation:
  • Sets (ব্যায়ামের রাউন্ড বা পর্ব)
  • Reps (একটি সেটে যতবার মুভমেন্ট করা হয়)
  • RPE (Rate of Perceived Exertion — ১-১০ স্কেলে চেষ্টার তীব্রতা)
  • Calorie Deficit/Surplus (ঘাটতি বা উদ্বৃত্ত)
  • Macronutrients (প্রোটিন, কার্বোহাইড্রেট, ফ্যাট)

4. DUAL-LANGUAGE FLUENCY (BENGALI & ENGLISH):
- If the user writes in Bengali (বাংলা) or the Language Mode is 'bn', respond fluently in natural, respectful, and encouraging Bengali. Use recognized fitness terms alongside Bengali explanations (e.g. ক্যালরি ঘাটতি, প্রোগ্রেসিভ ওভারলোড, প্রোটিন, হাইপারট্রফি).
- If the user writes in English or Language Mode is 'en', reply in articulate, motivating, high-performance athletic English.
- If the user uses Banglish or mixed terms, adapt naturally with maximum clarity.

5. FORMATTING:
- Use clean, modern Markdown with bold headings, neat bullet points, and concise paragraphs.
- Keep responses readable and actionable. Avoid unnecessary padding.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userContext } = body as {
      messages?: ChatMessage[];
      userContext?: UserContext;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Messages array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isBn = userContext?.language === "bn";

    if (!apiKey) {
      return NextResponse.json({
        reply: isBn
          ? "⚠️ **Gemini API Key সংযুক্ত নেই।**\n\nঅনুগ্রহ করে আপনার প্রজেক্টের `.env.local` ফাইলে `GEMINI_API_KEY=your_gemini_api_key` যোগ করুন এবং সার্ভার রিস্টার্ট করুন।\n\n*(Google AI Studio থেকে একটি ফ্রি API Key তৈরি করে নিতে পারেন।)*"
          : "⚠️ **Gemini API Key is not configured.**\n\nPlease add `GEMINI_API_KEY=your_gemini_api_key` to your `.env.local` file and restart your Next.js development server.\n\n*(You can generate a free key from Google AI Studio.)*",
        isMissingKey: true,
      });
    }

    const systemInstructionText = buildSystemInstruction(userContext);

    // Filter and format messages for the Gemini REST endpoint
    // Gemini contents must alternate or start with a 'user' role
    const formattedContents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];

    for (const msg of messages) {
      const role = msg.role === "assistant" ? "model" : "user";
      // Avoid leading model messages
      if (formattedContents.length === 0 && role === "model") {
        continue;
      }
      formattedContents.push({
        role,
        parts: [{ text: msg.content }],
      });
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

    // Attempt with gemini-2.5-flash, fallback to gemini-1.5-flash if unavailable
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
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
          // If 404 or model not supported, continue to next model in list
          if (geminiRes.status === 404) {
            continue;
          }
          // If auth error or rate limit, break and report
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
          ? `⚠️ **Gemini API সংযোগে ত্রুটি হয়েছে:**\n\n${lastError || "অনুরোধ প্রক্রিয়া করতে ব্যর্থ হয়েছে।"}\n\nঅনুগ্রহ করে আপনার API Key এবং ইন্টারনেট সংযোগ যাচাই করুন।`
          : `⚠️ **Gemini API Error:**\n\n${lastError || "Failed to process request."}\n\nPlease verify your API Key and network connection.`,
        error: lastError,
      });
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: unknown) {
    console.error("Assistant chat route error:", error);
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
