import { NextResponse } from "next/server";

interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
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
    ? `[User Telemetry & Biometrics]:
- Current BMI: ${userContext.bmi ? userContext.bmi.toFixed(1) : "Not recorded"}
- Weight: ${userContext.weight ? `${userContext.weight} kg` : "Not recorded"}
- Height: ${userContext.height ? `${userContext.height} cm` : "Not recorded"}
- Primary Goal: ${userContext.goal || "Healthy living & sustainable fitness"}
- Target Calories: ${userContext.caloriesTarget || 2000} kcal
- Target Water: ${userContext.waterTarget || 2500} ml`
    : "[No biometric profile passed]";

  return `You are the AI Fitness, Nutrition & Habit Mentor for "Iron & Habit" (আইরন অ্যান্ড হ্যাবিট).
Your Persona:
- Supportive, wise, evidence-based fitness mentor.
- Empathetic coach who listens deeply and empowers users step by step.

${bioSummary}

CORE BEHAVIOR RULES:

1. TRUE SOCRATIC EMPATHY & QUESTIONING:
- NEVER dump huge generic gym routines or overwhelming multi-page workouts right away.
- When users ask broad questions or request plans, first guide them thoughtfully and ask 1 to 2 gentle follow-up questions to understand:
  • Their current physical limits, joint issues, or past injuries (knees, lower back, shoulders).
  • Their typical daily schedule, energy levels, and available time (e.g. 10 mins vs 45 mins).
  • Their access to equipment (exercising at home, bodyweight, or a gym).
  • Their food preferences and budget (e.g. simple home-cooked staples).
- If the user has already provided specific answers or asks a direct tactical question (e.g. "How much protein in 2 eggs?", "What is progressive overload?"), deliver the clear, direct answer immediately.

2. REAL-WORLD EVERYDAY ANALOGIES:
- Demystify fitness science using intuitive, everyday analogies:
  • Calorie Deficit/Surplus: Compare food fuel to a phone battery or car fuel tank (eating slightly less draws from your backup power bank safely; crash diets trigger low-battery throttling).
  • Progressive Overload: Compare to leveling up in a video game or learning a language (you don't start with fluent novels; you master the alphabet first, adding 1% more reps or weights gradually).
  • Muscle Recovery & Sleep: Compare muscles to road repair or nightly phone software updates (the workout creates the signal, but the actual rebuilding happens during restful sleep).
  • Consistency & Habits: Compare to brushing your teeth or keeping a pot boiling (tiny daily maintenance takes minimal effort; restarting from zero every month is exhausting).

3. BEGINNER-FIRST WARMTH & ENCOURAGEMENT:
- When a user mentions being a complete beginner, out of shape, nervous, or returning after years:
  • Validate their courage warmly. Acknowledge that starting is the hardest step.
  • Dissolve intimidation and fitness guilt.
  • Recommend tiny, frictionless 5 to 10-minute starter habits (such as a brisk walk, gentle dynamic stretching, or simply drinking an extra glass of water).
  • Emphasize consistency and self-compassion over intensity.

4. TRUTH & SAFETY FIRST:
- Ground recommendations in real human biology and exercise physiology.
- Firmly debunk gimmicks (spot reduction of belly fat is biologically impossible; sweat alone does not mean fat loss; detox teas and starvation diets harm metabolic health).
- SAFETY MANDATE: If someone reports chronic pain, sharp joint issues, dizziness, or underlying medical conditions, kindly advise consulting a physician or physical therapist.

5. BILINGUAL FLUENCY (BENGALI & ENGLISH):
- If the user writes in Bengali or Language Mode is 'bn', reply in warm, respectful, natural Bengali (বাংলা) using clean terms (ক্যালরি ঘাটতি, প্রোগ্রেসিভ ওভারলোড, রিকভারি).
- If English or 'en', reply in clear, inspiring, articulate English.
- Use clean Markdown with bold headers and neat bullet points.`;
}

function getEmpatheticFallbackReply(userText: string, isBn: boolean): string {
  const lower = userText.toLowerCase();

  // Beginner query
  if (
    lower.includes("beginner") ||
    lower.includes("নতুন") ||
    lower.includes("শুরু") ||
    lower.includes("start")
  ) {
    if (isBn) {
      return `🌱 **স্বাগতম বন্ধু! শুরু করার সিদ্ধান্ত নেওয়াই আপনার সবচেয়ে বড় সাহসিকতা।**

শরীরচর্চাকে শুরুতে একটি **স্মার্টফোনের ব্যাটারির মতো** বিবেচনা করুন—আমরা ব্যাটারি হঠাৎ করে নষ্ট করতে চাই না, বরং ধীরে ধীরে তার ধারণক্ষমতা বাড়াতে চাই। প্রথমেই জিম বা ভারী ওজনের কোনো প্রয়োজন নেই।

**আজকের জন্য আপনার একমাত্র লক্ষ্য হোক ৫-১০ মিনিটের সহজ জয়:**
• ঘুম থেকে উঠে এক গ্লাস পানি পান করা।
• ৫-১০ মিনিট উন্মুক্ত জায়গায় বা ছাদে হালকা হাঁটা (Brisk Walking)।
• হাত, ঘাড় ও কোমরের সহজ কিছু স্ট্রেচিং।

আমাকে একটু খুলে বলুন তো:
১. আপনার কি হাঁটু, কোমর বা শরীরের কোথাও কোনো পুরোনো ব্যথা বা সমস্যা আছে?
২. প্রতিদিন সকালে নাকি বিকেলে—কোন সময়টা আপনার জন্য সবচেয়ে সহজ মনে হয়?

*(টিপ: গুগল জেমিনি এআই লাইভ মডেল সক্রিয় করতে \`.env.local\` ফাইলে আপনার \`GEMINI_API_KEY\` যুক্ত করে নিন।)*`;
    }
    return `🌱 **Welcome my friend! Taking this very first step takes real courage.**

Think of fitness like charging a **phone battery**—we don't want to overheat or drain the battery on day one; we want to build lasting battery capacity. You don't need fancy gym equipment or exhausting 2-hour workouts.

**Your only goal today is a simple 5–10 minute starter win:**
• Drink a fresh glass of water to wake up your metabolism.
• Take a brisk 5–10 minute walk outdoors or around your home.
• Do a few gentle shoulder rolls and hamstring stretches.

Could you tell me a little bit about yourself?
1. Do you currently have any joint pain or old injuries (knees, lower back)?
2. How much free time do you comfortably have in your daily routine?

*(Tip: To enable live Gemini AI generation, add your \`GEMINI_API_KEY\` in \`.env.local\`.)*`;
  }

  // Home food & nutrition query
  if (
    lower.includes("খাবার") ||
    lower.includes("ঘরোয়া") ||
    lower.includes("food") ||
    lower.includes("diet") ||
    lower.includes("meal") ||
    lower.includes("nutrition")
  ) {
    if (isBn) {
      return `🥗 **সাধারণ ঘরোয়া খাবার দিয়েই সুস্থ ও শক্তিশালী থাকা ১০০% সম্ভব!**

দামি বিদেশী সুপারফুডের কোনো প্রয়োজন নেই। খাবারকে আপনি **গাড়ির ভালো মানের জ্বালানির মতো** কল্পনা করুন—ভালো ফুয়েল দিলে ইঞ্জিন দীর্ঘ বছর মসৃণ চলে।

**সহজ ৩টি ঘরোয়া নিয়ম:**
• **প্রতি বেলাতেই প্রোটিনের ছোঁয়া**: ডাল-ভাতের সাথে ১-২টি সেদ্ধ বা পোচ ডিম, অথবা এক টুকরো মাছ বা মুরগির মাংস রাখুন।
• **থালায় শাকসবজি ও সালাদ**: ভাতের পরিমাণ সামান্য পরিমিত রেখে শাকসবজি ও শসা-টমেটোর অংশ বড় রাখুন।
• **অতিরিক্ত ভাজাপোড়া ও মিষ্টি নিয়ন্ত্রণ**: রান্নায় তেলের অতিরিক্ত ব্যবহার এবং প্যাকেটজাত কোমল পানীয় এড়িয়ে চলাই যথেষ্ট।

আপনার প্রতিদিনের স্বাভাবিক খাদ্যতালিকায় কোন কোন খাবারগুলো সবচেয়ে বেশি থাকে? জানিয়ে দিলে সেগুলোর আলোকেই মানানসই সমাধান তৈরি করব!`;
    }
    return `🥗 **You can absolutely achieve vibrant health with simple home-cooked meals!**

Think of food like **clean fuel for your vehicle**—when you provide steady, quality nutrition, your engine runs smoothly without sputtering. You don't need expensive exotic superfoods.

**3 Simple Home Principles:**
• **Anchor every meal with protein**: Include 1–2 eggs, lentils (dal), chicken, fish, or tofu.
• **Prioritize color & fiber**: Fill half your plate with leafy greens, seasonal vegetables, or cucumbers.
• **Mindful cooking oils**: Reduce heavy deep-frying and avoid sugary sodas or excessive juices.

What are 2 or 3 of your favorite regular home staples? Tell me what you normally eat, and we can easily tailor them together!`;
  }

  // Busy day / 10-minute workout
  if (
    lower.includes("১০ মিনিট") ||
    lower.includes("10 minute") ||
    lower.includes("ব্যস্ত") ||
    lower.includes("busy") ||
    lower.includes("workout") ||
    lower.includes("ব্যায়াম")
  ) {
    if (isBn) {
      return `⏱️ **ব্যস্ত দিনে মাত্র ১০ মিনিট সময়ই আপনার শরীরের জন্য চমৎকার রিফ্রেশার!**

শরীরচর্চাকে **দাঁত মাজার মতো একটি স্বয়ংক্রিয় অভ্যাস** হিসেবে ভাবুন। সময় কম থাকলে দীর্ঘ রুটিনের চাপ না নিয়ে নিচের এই ৩টি সহজ মুভমেন্ট ট্রাই করুন:

১. **বডিওয়েট স্কোয়াট (Squats)**: ১০-১২ বার — পা ও কোমরের পেশি সচল রাখে।
২. **ওয়াল বা ইনক্লাইন পুশ-আপ (Wall Push-ups)**: ৮-১০ বার — বুক ও কাঁধের শক্তি বাড়ায়।
৩. **হালকা স্ট্রেচিং ও ডিপ ব্রিদিং**: ২-৩ মিনিট — স্নায়ু শান্ত করে ক্লান্তি কমায়।

আপনি কি কোনো জয়েন্টে ব্যথা অনুভব করেন, নাকি একদম স্বাচ্ছন্দ্যে মুভ করতে পারেন?`;
    }
    return `⏱️ **On busy days, even 10 minutes can completely restart your mental and physical energy!**

Think of quick workouts like **brushing your teeth**—a small, non-negotiable daily maintenance habit that keeps everything strong.

**A Quick 10-Minute Starter Flow:**
1. **Bodyweight Squats**: 10–12 controlled reps (activates your largest muscle groups).
2. **Incline or Wall Push-ups**: 8–10 reps (builds chest, shoulder, and core tone).
3. **Standing High Knees / Brisk March**: 2 minutes (gets circulation flowing).
4. **Gentle Full-Body Stretch & Deep Breathing**: 2 minutes.

Do you have any physical restrictions or discomfort when doing basic movements? Let me know!`;
  }

  // Consistency & Motivation
  if (
    lower.includes("আগ্রহ") ||
    lower.includes("motivation") ||
    lower.includes("consistent") ||
    lower.includes("ধরে রাখার") ||
    lower.includes("রুটিন")
  ) {
    if (isBn) {
      return `🔥 **ব্যায়ামে আগ্রহ ধরে রাখার সবচেয়ে বড় গোপন রহস্য: মোটিভেশনের ওপর নির্ভর না করা!**

মোটিভেশন হলো আবহাওয়ার মতো—একদিন ভালো, পরদিন মেঘলা। কিন্তু **অভ্যাস হলো আপনার নিঃশ্বাসের মতো স্থায়ী**।

**ধারাবাহিক থাকার ৩টি নীতি:**
• **লক্ষ্যকে এত সহজ রাখুন যাতে না বলা অসম্ভব হয়**: 'আজ এক ঘণ্টা ঘাম ঝরাব' না ভেবে বলুন 'আজ শুধু ৫ মিনিট হাঁটব'।
• **ক্যালেন্ডারে টিক দিন**: প্রতিদিনের ছোট জয় ট্র্যাক করুন; মানুষ নিজের অগ্রগতি দেখলে প্রাকৃতিকভাবেই আনন্দ পায়।
• **নিজেকে ক্ষমা করতে শিখুন**: কোনো একদিন মিস হলে মন খারাপ করবেন না। শুধু একটাই স্বর্ণালী নিয়ম: *পরপর দুই দিন কখনো মিস করবেন না।*

গত কয়েক দিনে আপনার ধারাবাহিকতা ভাঙার পেছনের মূল কারণ কী ছিল—সময় নাকি ক্লান্তি?`;
    }
    return `🔥 **The secret to lasting fitness isn't superhuman motivation—it's building gentle momentum!**

Motivation is like the weather—warm one day, rainy the next. **Habits are like gravity—they pull you forward effortlessly.**

**3 Golden Consistency Rules:**
• **Make the bar ridiculously low**: Instead of "I must do a 60-minute brutal workout," commit to "I will do 5 minutes of movement." Starting is 90% of the battle.
• **Track your streak**: Seeing your unbroken streak triggers dopamine and reinforces identity.
• **The Never-Miss-Twice Rule**: Missing one day is life; missing two days is the start of a new, unwanted habit. Reset immediately with self-compassion.

What usually holds you back the most when life gets hectic—lack of time, low energy, or self-doubt?`;
  }

  // General Socratic reply
  if (isBn) {
    return `🤝 **আপনার প্রশ্নটি আমি আন্তরিকভাবে গ্রহণ করেছি।**

আয়রন অ্যান্ড হ্যাবিটে আমরা কোনো বাঁধাধরা জাদুকরী ফর্মুলা চাপিয়ে দিই না; বরং আপনার ব্যক্তিগত জীবনযাপন ও শরীরবৃত্তীয় অবস্থার সাথে মিলিয়ে সমাধান খুঁজি।

আপনার লক্ষ্য সুন্দরভাবে অর্জন করার জন্য আমাকে একটু বলুন:
১. এই মুহূর্তে আপনার প্রধান ফিটনেস লক্ষ্য কী (ওজন কমানো, মেদ হ্রাস, পেশি বৃদ্ধি, নাকি স্রেফ ফিট থাকা)?
২. আপনার শরীরে কি কোনো জয়েন্ট বা পুরনো ব্যথার ইতিহাস রয়েছে?

আপনার উত্তর দিলে আমি ঠিক আপনার উপযোগী একটি সহজ ও টেকসই পথনির্দেশনা দিতে পারব!`;
  }

  return `🤝 **Thank you for sharing that with me.**

At Iron & Habit, we don't believe in generic one-size-fits-all routines. Every body and lifestyle has its own unique rhythm.

To help you with the most effective, personalized guidance:
1. What is your primary focus right now (fat loss, strength, mobility, or energy)?
2. Do you have any physical limitations or past injuries I should protect?

Share a quick thought, and we'll craft a gentle, sustainable path forward together!`;
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

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isBn = userContext?.language === "bn";
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user")?.content || "";

    // If API key is not configured or blank, provide rich Socratic mentor fallback
    if (!apiKey) {
      const fallbackReply = getEmpatheticFallbackReply(lastUserMessage, isBn);
      return NextResponse.json({
        reply: fallbackReply,
        isMissingKey: true,
      });
    }

    const systemInstructionText = buildSystemInstruction(userContext);

    // Format messages for Gemini API
    const formattedContents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];

    for (const msg of messages) {
      const role = msg.role === "assistant" ? "model" : "user";
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

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
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
      console.warn("Gemini API call failed or key invalid, using empathetic fallback:", lastError);
      const fallbackReply = getEmpatheticFallbackReply(lastUserMessage, isBn);
      return NextResponse.json({
        reply: fallbackReply,
        warning: lastError,
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
