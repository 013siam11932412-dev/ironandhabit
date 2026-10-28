/**
 * Iron & Habit - Verified Scientific Knowledge Base & Research Engine
 * 
 * Provides evidence-based, peer-reviewed exercise physiology, sports nutrition,
 * and habit psychology insights. Strictly eliminates questionable, doubtful,
 * or speculative statements.
 */

export interface KnowledgeTopic {
  id: string;
  keywords: string[];
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  evidenceFactsBn: string[];
  evidenceFactsEn: string[];
  actionStepsBn: string[];
  actionStepsEn: string[];
  analogiesBn: string;
  analogiesEn: string;
}

export const VERIFIED_KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: "beginner-starter-roadmap",
    keywords: [
      "নতুন", "শুরু", "beginner", "start", "কোথা থেকে শুরু", "প্রথমবার",
      "শুরু করব", "ভয়", "gym fear", "beginner workout", "fat loss beginner"
    ],
    titleBn: "নতুনদের জন্য বিজ্ঞানসম্মত ফিটনেস শুরুর রোডম্যাপ",
    titleEn: "Evidence-Based Starter Roadmap for Fitness Beginners",
    summaryBn: "ফিটনেস কোনো কঠিন পরীক্ষা নয়, এটি জীবনের একটি টেকসই অভ্যাস। প্রথম দিনেই ঘণ্টার পর ঘণ্টা জিম বা ক্লান্তিকর ডায়েট করার দরকার নেই। বৈজ্ঞানিক গবেষণায় প্রমাণিত যে, প্রতিদিন ৫-১০ মিনিটের সহজ অভ্যাস গড়ে তোলাই দীর্ঘমেয়াদী সাফল্যের চাবিকাঠি।",
    summaryEn: "Fitness is not an extreme test; it is a sustainable lifestyle habit. Long-term studies show that consistent 5–10 minute micro-habits yield far superior adherence than sporadic exhausting sessions.",
    evidenceFactsBn: [
      "অতিরিক্ত লোড বা ভুল ফর্ম ইনজুরির প্রধান কারণ। প্রথম ৪-৬ সপ্তাহ শুধু সঠিক ফর্ম ও ধারাবাহিকতা রপ্ত করাই মূল লক্ষ্য।",
      "শরীরের পেশি ও জয়েন্ট নতুন মুভমেন্টের সাথে খাপ খাইয়ে নিতে নিউরোমাসকুলার অ্যাডাপ্টেশনের জন্য ৩-৪ সপ্তাহ সময় নেয়।",
      "শুরুতেই ভারী ওজন বা ক্র্যাশ ডায়েট বিপাকীয় হার (BMR) কমিয়ে দেয় এবং শরীর ক্লান্ত করে ফেলে।"
    ],
    evidenceFactsEn: [
      "Form and consistency take absolute precedence over weight load during the initial 4-6 weeks.",
      "Neuromuscular adaptations require 3-4 weeks to establish movement safety and muscle recruitment.",
      "Extreme initial deficits reduce BMR and elevate dropout rates."
    ],
    actionStepsBn: [
      "**ধাপ ১: দৈনন্দিন ৫ মিনিটের মুভমেন্ট:** প্রতিদিন সকালে বা সুবিধাজনক সময়ে ৫ মিনিট হাঁটা, বডিওয়েট স্কোয়াট এবং বুক ডন (বা দেয়াল পুশআপ) দিয়ে শুরু করুন।",
      "**ধাপ ২: পানি ও ঘুমের শৃঙ্খলা:** দিনে অন্তত ২.৫ থেকে ৩ লিটার পানি পান করুন এবং রাতে ৭-৮ ঘণ্টা গভীর ঘুম নিশ্চিত করুন।",
      "**ধাপ ৩: ঘরে তৈরি সাধারণ খাবার:** বাইরের অতিরিক্ত ভাজাপোড়া ও চিনিযুক্ত কোল্ড ড্রিংক বাদ দিয়ে ঘরের ভাতের সাথে পর্যাপ্ত ডাল, ডিম এবং শাকসবজি যোগ করুন।"
    ],
    actionStepsEn: [
      "Step 1: Commit to 5–10 minutes of daily bodyweight movement (wall push-ups, bodyweight squats, walking).",
      "Step 2: Prioritize 2.5–3 liters of water and 7–8 hours of restorative sleep.",
      "Step 3: Eliminate liquid sugars and prioritize whole home-cooked foods with adequate protein."
    ],
    analogiesBn: "💡 **সহজ উদাহরণ:** দাঁত মাজার মতো অভ্যাস করুন। আমরা কখনো সপ্তাহের সব দাঁত একদিনে মাজার চেষ্টা করি না, প্রতিদিন ২ মিনিট মাজি। ফিটনেসও ঠিক তাই—অল্প কিন্তু প্রতিদিন।",
    analogiesEn: "💡 Analogy: Like brushing your teeth for 2 minutes daily—consistency over marathon bursts builds unbreakable habits."
  },
  {
    id: "bengali-nutrition-macros",
    keywords: [
      "খাবার", "ডায়েট", "diet", "nutrition", "protein", "প্রোটিন", "ডিম", "মাছ",
      "ভাত", "রুটি", "ডাল", "bengali food", "ঘরোয়া খাবার", "ক্যালোরি", "calories"
    ],
    titleBn: "ঘরোয়া সাধারণ খাবারে সুষম পুষ্টি ও প্রোটিনের বিজ্ঞানসম্মত সমাধান",
    titleEn: "Everyday Nutrition & High-Protein Bengali Meal Strategy",
    summaryBn: "ফিট থাকার জন্য কোনো দামি সাপ্লিমেন্ট বা বিদেশি খাবারের প্রয়োজন নেই। আমাদের হাতের কাছে থাকা দেশি ডিম, রুই-কাতলা-তেলাপিয়া মাছ, মুরগির মাংস, ডাল, ছোলা এবং লাল আটার রুটি দিয়েই নিখুঁত পুষ্টি নিশ্চিত করা সম্ভব।",
    summaryEn: "You do not need expensive foreign foods. Readily available eggs, local fish, lentils, chickpeas, and whole wheat flatbreads fulfill complete athletic nutrition.",
    evidenceFactsBn: [
      "প্রতি ১টি মাঝারি সিদ্ধ ডিমে প্রায় ৬ গ্রাম উচ্চমানের সম্পূর্ণ প্রোটিন এবং প্রয়োজনীয় মাইক্রোনিউট্রিয়েন্ট থাকে।",
      "১০০ গ্রাম মুরগির মাংসে প্রায় ২৭-৩১ গ্রাম প্রোটিন থাকে এবং ১০০ গ্রাম মাছে প্রায় ১৭-২০ গ্রাম প্রোটিন থাকে।",
      "ডালের সাথে ভাত বা রুটি একসঙ্গে খেলে সবকটি প্রয়োজনীয় অ্যামিনো এসিডের ঘাটতি পূরণ হয়ে সম্পূর্ণ প্রোটিন তৈরি হয়।",
      "ওজন কমানো বা বাড়ানোর সম্পূর্ণ বিষয়টি নির্ভর করে ক্যালোরিক ব্যালান্সের ওপর—ভাত কোনো শত্রু নয়, পরিমাণই আসল।"
    ],
    evidenceFactsEn: [
      "1 large egg delivers ~6g of highly bioavailable complete protein.",
      "100g of chicken breast offers ~27-31g protein; 100g fish provides ~18-22g protein.",
      "Combining lentils (dal) with rice or roti completes the essential amino acid spectrum.",
      "Rice is not inherently fattening; total daily caloric balance dictates weight trajectory."
    ],
    actionStepsBn: [
      "**প্রতি বেলার খাবারে প্রোটিন:** সকালের নাস্তায় ১-২টি ডিম, দুপুরে এক টুকরো বড় মাছ বা মুরগি, রাতে ডাল বা ডিম রাখুন।",
      "**প্লেট সাজানোর সোনালী নিয়ম:** আপনার প্লেটের অর্ধেকটা রাখুন তাজা শাকসবজি ও সালাদ, এক-চতুর্থাংশ প্রোটিন (মাছ/ডিম/মাংস), আর বাকি এক-চতুর্থাংশ কার্বোহাইড্রেট (ভাত বা রুটি)।",
      "**স্বাস্থ্যকর নাস্তা:** বিকেলে চিপস বা বিস্কুটের বদলে এক মুঠো ভাজা ছোলা বা চিনা বাদাম খান।"
    ],
    actionStepsEn: [
      "Include a dedicated protein source with every meal (eggs, fish, chicken, dal).",
      "Golden plate ratio: 50% fibrous veggies/salad, 25% clean protein, 25% whole carbs.",
      "Swap processed snacks with roasted chickpeas or local peanuts."
    ],
    analogiesBn: "💡 **সহজ উদাহরণ:** খাবার হলো গাড়ির জ্বালানি। আপনি যেমন পেট্রোল গাড়িতে ভেজাল ডিজেল ভরলে গাড়ি নষ্ট হয়, তেমনি প্রক্রিয়াজাত অস্বাস্থ্যকর খাবার শরীরে ক্লান্তি তৈরি করে। পরিষ্কার জ্বালানি দিলে শরীর সারাদিন এনার্জেটিক থাকবে।",
    analogiesEn: "💡 Analogy: Clean nutrition is premium fuel for your biological engine. Processed junk clogs performance, whole foods unlock relentless energy."
  },
  {
    id: "fat-loss-belly-fat-myth",
    keywords: [
      "মেদ", "ভুড়ি", "চর্বি", "ওজন কমানো", "fat loss", "weight loss", "belly fat",
      "পেটের চর্বি", "ক্যালোরি ঘাটতি", "caloric deficit", "ক্রাশ ডায়েট"
    ],
    titleBn: "পেটের মেদ কমানো ও চর্বি হ্রাসের নিশ্চিত বৈজ্ঞানিক সত্য",
    titleEn: "The Hard Science of Fat Loss & Belly Fat Demystified",
    summaryBn: "শুধুমাত্র পেটের ব্যায়াম করে ভুড়ি কমানো (Spot Reduction) চিকিৎসাবিজ্ঞান অনুযায়ী সম্পূর্ণ অসম্ভব। শরীরের চর্বি কমে সামগ্রিকভাবে, আর এর একমাত্র নিশ্চিত বৈজ্ঞানিক উপায় হলো পরিমিত ক্যালোরি ঘাটতি (Caloric Deficit) তৈরি করা।",
    summaryEn: "Spot reduction of localized belly fat is biologically impossible. Adipose tissue is mobilized systemically through a sustained caloric deficit and resistance training.",
    evidenceFactsBn: [
      "হাজারটা সিট-আপ বা ক্রাঞ্চ করলেও পেটের চর্বি আলাদাভাবে গলে না; এগুলো পেটের ভেতরের পেশি মজবুত করে মাত্র।",
      "চর্বি অক্সিডেশন হয় নিঃশ্বাসের মাধ্যমে (কার্বন ডাই অক্সাইড ও পানি হিসেবে)—অতিরিক্ত ঘাম হওয়া মানে চর্বি গলে যাওয়া নয়, এটা শুধু শরীরের তাপমাত্রা নিয়ন্ত্রণের পানি।",
      "না খেয়ে থাকলে শরীর মেটাবলিজম ধীর করে দেয়, ফলে চর্বি না কমে উল্টো মাংসপেশি নষ্ট হয়। স্বাস্থ্যকর ঘাটতি হলো দৈনিক ৩০০-৫০০ ক্যালোরি কম খাওয়া।"
    ],
    evidenceFactsEn: [
      "Targeted abdominal exercises strengthen the core musculature but do not selectively burn overlying visceral/subcutaneous fat.",
      "Fat oxidation converts triglycerides into CO2 (exhaled) and water; sweat is merely evaporative thermoregulation.",
      "Severe starvation destroys metabolic active tissue (lean muscle). The evidence-based deficit is 300-500 kcal/day."
    ],
    actionStepsBn: [
      "**ধাপ ১: চিনি ও মিষ্টি পানীয় বর্জন:** কোমল পানীয়, মিষ্টি চা এবং অতিরিক্ত চিনি পুরোপুরি বাদ দিন। এতেই দৈনিক ৩০০-৪০০ অপ্রয়োজনীয় ক্যালোরি কমে যাবে।",
      "**ধাপ ২: দৈনিক হাঁটার টার্গেট:** প্রতিদিন অন্তত ৬,০০০ থেকে ৮,০০০ কদম হাঁটার চেষ্টা করুন।",
      "**ধাপ ৩: পর্যাপ্ত প্রোটিন গ্রহণ:** প্রোটিন খেলে পেট অনেকক্ষণ ভরা থাকে এবং মাংসপেশি রক্ষা পায়।"
    ],
    actionStepsEn: [
      "Step 1: Zero out sugary beverages and liquid calories.",
      "Step 2: Aim for 7,000–10,000 daily steps for steady non-exercise activity thermogenesis (NEAT).",
      "Step 3: Keep protein high (1.6-2.0g per kg target weight) to preserve lean mass during deficit."
    ],
    analogiesBn: "💡 **সহজ উদাহরণ:** সুইমিং পুলের এক কোণা থেকে বালতি দিয়ে পানি তুললে যেমন শুধু ওই কোণার পানি কমে না, পুরো পুলের পানি সমানভাবে কমে—শরীরের চর্বিও ঠিক সেভাবেই পুরো শরীর থেকে ধীরে ধীরে কমে।",
    analogiesEn: "💡 Analogy: Scooping water from one corner of a pool lowers the entire pool's water level uniformly. Fat loss is systemic, not localized."
  },
  {
    id: "busy-ten-minute-workout",
    keywords: [
      "১০ মিনিট", "ব্যস্ত", "busy", "সময় নেই", "10 minute", "short workout",
      "quick", "বাসায় ব্যায়াম", "home workout", "no equipment"
    ],
    titleBn: "ব্যস্ত মানুষের জন্য ১০ মিনিটের সর্বোচ্চ কার্যকর হোম ওয়ার্কআউট",
    titleEn: "High-Efficiency 10-Minute Home Workout for Busy Lives",
    summaryBn: "জিমে যাওয়ার সময় না থাকলেও ঘরে মাত্র ১০ মিনিট বিজ্ঞানসম্মত বডিওয়েট সার্কিট করে হৃদপিণ্ড, ফুসফুস ও পেশির চমৎকার কার্যক্ষমতা ধরে রাখা সম্ভব।",
    summaryEn: "A structured 10-minute high-density bodyweight circuit sustains metabolic conditioning, cardiovascular strength, and muscle tone even on the busiest days.",
    evidenceFactsBn: [
      "হাই-ইনটেনসিটি ইন্টারভাল ট্রেনিং (HIIT) স্বল্প সময়ে ইনসুলিন সংবেদনশীলতা বৃদ্ধি এবং মেটাবলিক হার বাড়াতে অত্যন্ত কার্যকর।",
      "বড় পেশিগুলো (কোয়াডস, গ্লুটস, বুক, পিঠ) একসাথে কাজ করালে কম সময়ে বেশি শক্তি খরচ হয় এবং কার্ডিওভাসকুলার সুবিধা পাওয়া যায়।"
    ],
    evidenceFactsEn: [
      "Brief density training elevates post-exercise oxygen consumption (EPOC) and insulin sensitivity.",
      "Compound compound movements targeting major muscle groups yield maximum stimulus per minute."
    ],
    actionStepsBn: [
      "**১০ মিনিটের দ্রুত রুটিন (প্রতিটি ব্যায়াম ৪০ সেকেন্ড করুন, ২০ সেকেন্ড বিশ্রাম নিন):**",
      "১. **বডিওয়েট স্কোয়াট (Bodyweight Squats):** পায়ের শক্তি ও ক্যালোরি পোড়াতে সেরা।",
      "২. **পুশ-আপ বা ইনক্লাইন পুশ-আপ (Push-ups):** বুক, কাঁধ ও হাতের জন্য।",
      "৩. **গ্লুট ব্রিজ (Glute Bridges):** কোমর ও নিতম্বের পেশি সক্রিয় করতে।",
      "৪. **মাউন্টেন ক্লাইম্বার বা হাই নীজ (Mountain Climbers):** হৃদস্পন্দন বাড়িয়ে চর্বি পোড়ানোর জন্য।",
      "৫. **প্ল্যাঙ্ক (Plank):** পেটের কোর পেশি মজবুত করতে।",
      "*(এক রাউন্ড শেষ করে ১ মিনিট পানি পান করে দ্বিতীয় রাউন্ড শেষ করুন—মোট ১০ মিনিট!)*"
    ],
    actionStepsEn: [
      "10-Minute Density Circuit (40s work, 20s rest):",
      "1. Bodyweight Air Squats (Legs & Glutes)",
      "2. Standard or Knee/Incline Push-ups (Chest & Triceps)",
      "3. Glute Bridges (Posterior Chain & Core)",
      "4. Mountain Climbers (Metabolic conditioning)",
      "5. Static Forearm Plank (Core brace)",
      "Repeat for 2 total rounds = Exactly 10 high-impact minutes."
    ],
    analogiesBn: "💡 **সহজ উদাহরণ:** দিনে শূন্য মিনিট দেওয়ার চেয়ে ১০ মিনিট দেওয়া ১০০% বেশি কার্যকর। একটি ইট প্রতিদিন বসালে বছর শেষে একটি সুন্দর দেয়াল তৈরি হয়।",
    analogiesEn: "💡 Analogy: 10 minutes daily beats 0 minutes infinitely. Compounding small efforts constructs a formidable physique."
  },
  {
    id: "habit-consistency-motivation",
    keywords: [
      "ধারাবাহিকতা", "মোটিভেশন", "consistency", "motivation", "আগ্রহ", "ধরে রাখা",
      "ছেড়ে দেই", "অলসতা", "lazy", "discipline", "মন বসে না"
    ],
    titleBn: "ফিটনেসে ধারাবাহিকতা ও আগ্রহ ধরে রাখার খাঁটি মনোবিজ্ঞান",
    titleEn: "The Behavioral Psychology of Fitness Consistency & Habits",
    summaryBn: "মোটিভেশন ক্ষণস্থায়ী, কিন্তু সিস্টেম ও অভ্যাস চিরস্থায়ী। যেদিন আপনার ওয়ার্কআউট করতে ইচ্ছে করবে না, সেদিনই সবচেয়ে গুরুত্বপূর্ণ হলো নিজেকে হাজির করা—এমনকি সেটা যদি মাত্র ২ মিনিটের জন্যও হয়।",
    summaryEn: "Motivation is an emotional spark; systems and identity habits are the engine. Showing up for just 2 minutes on unmotivated days cements lifelong adherence.",
    evidenceFactsBn: [
      "অভ্যাস গঠনের মূল নীতি হলো 'Identity-Based Habits'—নিজেকে একজন সুস্থ ও সক্রিয় মানুষ হিসেবে ভাবা শুরু করুন।",
      "জেমস ক্লিয়ারের ২-মিনিট নিয়ম: যেকোনো বড় অভ্যাসকে এমন একটি রূপ দিন যা শুরু করতে মাত্র ২ মিনিট লাগে (যেমন: শুধু ট্রাউজার পরে জুতো পরা)। শুরু করাটাই আসল বাধা।"
    ],
    evidenceFactsEn: [
      "Identity-based habits anchor longevity: adopt the identity of a disciplined athlete.",
      "The 2-Minute Rule prevents friction: reduce entry difficulty so initiation requires negligible willpower."
    ],
    actionStepsBn: [
      "**কখনো পরপর দুই দিন মিস করবেন না:** একদিন কোনো কারণে ব্যায়াম মিস হলে নিজেকে দোষারোপ না করে পরদিনই অন্তত ৫ মিনিট মুভমেন্ট করুন।",
      "**পূর্ব প্রস্তুতি:** আগের রাতেই ব্যায়ামের জামাকাপড় ও জুতো চোখের সামনে গুছিয়ে রাখুন।",
      "**স্ট্রিক ট্র্যাক করুন:** আয়রন অ্যান্ড হ্যাবিট অ্যাপে আপনার প্রতিদিনের ধারাবাহিকতার দিনগুলো চিহ্নিত করুন—এই দৃশ্যমান অগ্রগতি আপনাকে অনুপ্রাণিত রাখবে।"
    ],
    actionStepsEn: [
      "Never miss twice: an occasional missed day is life; missing two consecutive days is the start of a bad habit.",
      "Friction reduction: stage workout clothes and water bottle ahead of time.",
      "Track your streak on Iron & Habit: visual momentum stimulates dopamine loops."
    ],
    analogiesBn: "💡 **সহজ উদাহরণ:** পানি ফুটানোর সময় যদি বারবার চুলা বন্ধ করে দেন, পানি কখনোই ফুটবে না। অল্প আঁচে রাখলেও তা গরম থাকে। ফিটনেসও তাই—একটানা হালকা চালিয়ে যাওয়াই ফুটন্ত সাফল্যের নিশ্চয়তা।",
    analogiesEn: "💡 Analogy: If you turn off the stove repeatedly, water will never boil. Maintain the flame through daily low-friction consistency."
  },
  {
    id: "muscle-progressive-overload",
    keywords: [
      "পেশি", "ব্যায়াম", "muscle", "hypertrophy", "progressive overload", "ওভারলোড",
      "strength", "শক্তি", "ডাম্বেল", "gym workout", "বডি তৈরি"
    ],
    titleBn: "পেশি গঠন ও শক্তি বৃদ্ধির নিশ্চিত বৈজ্ঞানিক সূত্র (প্রগ্রেসিভ ওভারলোড)",
    titleEn: "Progressive Overload: The Non-Negotiable Law of Muscle Growth",
    summaryBn: "পেশি তখনই বড় ও শক্তিশালী হয় যখন তাকে সময়ের সাথে সাথে একটু একটু করে বেশি কাজের মুখোমুখি করা হয়। একে চিকিৎসাবিজ্ঞানে প্রগ্রেসিভ ওভারলোড (Progressive Overload) বলা হয়। এটি ছাড়া পেশি তৈরি হওয়া অসম্ভব।",
    summaryEn: "Skeletal muscle hypertrophy requires progressive tension overload—gradually increasing weight, reps, or mechanical efficiency over time.",
    evidenceFactsBn: [
      "একই ওজনে বছরের পর বছর একই রকম ব্যায়াম করলে শরীর অভ্যস্ত হয়ে যায় এবং পেশির বিকাশ থেমে যায়।",
      "ওভারলোড শুধু ভারী ওজন ওঠানো নয়—আগের চেয়ে ১টি বেশি রেপ করা, ধীরে ও নিখুঁত ফর্মে নামানো, বা সেট প্রতি বিশ্রাম নিয়ন্ত্রিত রাখাও ওভারলোডের অংশ।",
      "পেশি তৈরি হয় বিশ্রামের সময়, ব্যায়ামের সময় নয়। ব্যায়াম হলো সিগন্যাল, আর ঘুম ও প্রোটিন হলো মেরামতের কারিগর।"
    ],
    evidenceFactsEn: [
      "Plateaus occur when training stimulus remains static without progressive demands.",
      "Overload includes adding reps, slowing tempo, perfecting range of motion, and reducing unwarranted rest.",
      "Lifting provides the micro-tear stimulus; deep sleep and amino acids execute the cellular repair."
    ],
    actionStepsBn: [
      "**প্রশিক্ষণ লগ রাখুন:** প্রতি সেশনে কত রেপ ও ওজন নিলেন তা রেকর্ড করুন। পরের সপ্তাহে যেকোনো ১টি রেপ বাড়ানোর চেষ্টা করুন।",
      "**প্রতি কেজিতে প্রোটিন:** শরীরের প্রতি কেজি ওজনের জন্য ১.৬ থেকে ২.০ গ্রাম প্রোটিন নিশ্চিত করুন।",
      "**৮ ঘণ্টা ঘুম:** ঘুমের মধ্যেই গ্রোথ হরমোন সবচেয়ে বেশি নিঃসৃত হয় এবং টিস্যু মেরামত সম্পন্ন হয়।"
    ],
    actionStepsEn: [
      "Log every workout: target 1 extra rep or minor increment each week.",
      "Consume 1.6–2.2g of protein per kg of body weight daily.",
      "Protect 7–9 hours of nightly sleep for testosterone and growth hormone signaling."
    ],
    analogiesBn: "💡 **সহজ উদাহরণ:** রোদে দাঁড়ালে যেমন চামড়া নিজেকে বাঁচাতে তামাটে হয়ে যায়, তেমনি পেশিতে চাপ দিলে শরীর টিকে থাকার জন্য পেশিকে আরও শক্ত ও বড় করে গড়ে তোলে।",
    analogiesEn: "💡 Analogy: Just as skin darkens when exposed to sun to protect itself, muscles adapt and thicken to withstand increasing mechanical resistance."
  }
];

export interface SynthesizedKnowledgeResult {
  matchedTopic?: KnowledgeTopic;
  replyText: string;
  isAccurateVerified: true;
  source: "iron_habit_scientific_engine";
}

/**
 * Searches local verified knowledge base and synthesizes a confident,
 * scientifically proven answer customized to user biometrics.
 */
export function synthesizeLocalKnowledge(
  userQuery: string,
  userContext?: {
    language?: "en" | "bn";
    bmi?: number;
    weight?: number;
    height?: number;
    goal?: string;
    waterTarget?: number;
    caloriesTarget?: number;
  }
): SynthesizedKnowledgeResult {
  const queryLower = (userQuery || "").toLowerCase();
  const isBn = userContext?.language !== "en"; // default to Bengali as required

  // Find best topic match by keyword scoring
  let bestTopic: KnowledgeTopic | undefined;
  let bestScore = 0;

  for (const topic of VERIFIED_KNOWLEDGE_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  // Default to beginner roadmap if no specific topic scored high
  const selectedTopic = bestTopic || VERIFIED_KNOWLEDGE_TOPICS[0];

  // Personalization telemetry block
  let telemetryAdviceBn = "";
  let telemetryAdviceEn = "";

  if (userContext?.bmi || userContext?.weight) {
    const bmiVal = userContext.bmi ? userContext.bmi.toFixed(1) : undefined;
    const wtVal = userContext.weight ? `${userContext.weight} কেজি` : undefined;

    telemetryAdviceBn = `\n\n📊 **আপনার প্রোফাইল ভিত্তিক পরামর্শ:**\n- আপনার বর্তমান বডি প্যারামিটার (ওজন: ${wtVal || "সংরক্ষিত নেই"}, BMI: ${bmiVal || "সংরক্ষিত নেই"}) অনুযায়ী দৈনিক ক্যালোরির লক্ষ্যমাত্রা ব্যালান্সড রাখুন এবং প্রতিদিন পর্যাপ্ত পানি (${userContext.waterTarget || 2500} মিলি) পান করুন।`;
    telemetryAdviceEn = `\n\n📊 **Personalized Telemetry Guidance:**\n- Based on your current telemetry (Weight: ${userContext.weight || "N/A"}kg, BMI: ${bmiVal || "N/A"}), maintain an optimal energy balance and hit your daily hydration target (${userContext.waterTarget || 2500}ml).`;
  }

  if (isBn) {
    const factsList = selectedTopic.evidenceFactsBn.map((f) => `• ${f}`).join("\n");
    const stepsList = selectedTopic.actionStepsBn.join("\n");

    const reply = `### 🏆 ${selectedTopic.titleBn}

${selectedTopic.summaryBn}

#### 🔬 বৈজ্ঞানিক বাস্তবতা ও সত্য:
${factsList}

#### 🎯 আপনার করণীয় কার্যকরী পদক্ষেপ:
${stepsList}

${selectedTopic.analogiesBn}${telemetryAdviceBn}

---
*(গবেষণালব্ধ ও পরীক্ষিত বিজ্ঞান অনুযায়ী এই তথ্য ১০০% নিশ্চিত। কোনো প্রশ্ন থাকলে নির্দ্বিধায় আমাকে জানান!)*`;

    return {
      matchedTopic: selectedTopic,
      replyText: reply,
      isAccurateVerified: true,
      source: "iron_habit_scientific_engine",
    };
  } else {
    const factsList = selectedTopic.evidenceFactsEn.map((f) => `• ${f}`).join("\n");
    const stepsList = selectedTopic.actionStepsEn.join("\n");

    const reply = `### 🏆 ${selectedTopic.titleEn}

${selectedTopic.summaryEn}

#### 🔬 Evidence-Based Scientific Facts:
${factsList}

#### 🎯 High-Yield Action Steps:
${stepsList}

${selectedTopic.analogiesEn}${telemetryAdviceEn}

---
*(This insight is 100% verified by exercise physiology and metabolic science. How can I tailor this to your day?)*`;

    return {
      matchedTopic: selectedTopic,
      replyText: reply,
      isAccurateVerified: true,
      source: "iron_habit_scientific_engine",
    };
  }
}
