"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col justify-between overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Ambient Lighting Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#ccff00]/[0.03] blur-[180px] rounded-full" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-30 w-full border-b border-[rgba(163,230,53,0.12)] bg-[#07090e]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#121826] border border-[#a3e635]/40 flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] group-hover:border-[#ccff00] transition-all">
              <svg
                className="w-5 h-5 text-[#ccff00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-black text-xl tracking-wider text-white">
              IRON <span className="text-[#ccff00]">&</span> HABIT
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold text-[#94a3b8] hover:text-[#ccff00] uppercase tracking-wider transition-colors"
            >
              ← {isBn ? "হোমপেজ" : "Home"}
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full flex-1">
        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(18,24,38,0.85)] border border-[rgba(163,230,53,0.3)] shadow-[0_0_15px_rgba(204,255,0,0.1)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#ccff00]">
              {isBn ? "আইনি ও গোপনীয়তা নীতিমালা" : "Privacy & Legal Standards"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            {isBn ? "গোপনীয়তা নীতি (Privacy Policy)" : "Privacy Policy"}
          </h1>

          <div className="text-xs font-mono text-[#94a3b8] flex items-center gap-2">
            <span>{isBn ? "সর্বশেষ আপডেট:" : "Last updated:"}</span>
            <span className="text-[#ccff00] font-bold">
              {isBn ? "১৮ অক্টোবর ২০২৬" : "18 October 2026"}
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-[#cbd5e1]">
          {/* Section 1: Introduction & Medical Notice */}
          <section className="card-neon-glass p-6 sm:p-8 rounded-2xl border-l-4 border-l-[#ccff00]">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-3">
              {isBn ? "১. গুরুত্বপূর্ণ স্বাস্থ্য ও পরামর্শ বিজ্ঞপ্তি" : "1. Health & Medical Notice"}
            </h2>
            <p className="mb-3 text-[#94a3b8]">
              {isBn
                ? "Iron & Habit-এ প্রদত্ত সকল তথ্য, ব্যায়াম প্রদর্শনী, পুষ্টি ট্র্যাকিং এবং কৃত্রিম বুদ্ধিমত্তা (AI) প্রতিক্রিয়া শুধুমাত্র সাধারণ নির্দেশিকা মাত্র, এটি কোনো চিকিৎসা পরামর্শ নয়।"
                : "All information, workout routines, nutrition metrics, and AI recommendations provided by Iron & Habit are for general guidance only and do not constitute medical advice."}
            </p>
            <p className="text-xs text-[#a3e635] bg-[rgba(163,230,53,0.08)] p-3 rounded-xl border border-[rgba(163,230,53,0.2)]">
              {isBn
                ? "যাদের পূর্ববর্তী কোনো শারীরিক অসুস্থতা, ইনজুরি, হৃদরোগ, গর্ভাবস্থা, খাওয়ার ব্যাধি (eating disorders) রয়েছে অথবা যাদের বয়স ১৮ বছরের নিচে, তাদের যেকোনো ব্যায়াম বা ডায়েট শুরু করার পূর্বে অবশ্যই চিকিৎসকের পরামর্শ নেওয়া উচিত।"
                : "Individuals with existing medical conditions, chronic injuries, cardiovascular risks, pregnancy, eating disorders, or those under 18 years of age should consult a qualified physician or healthcare professional before beginning any exercise or nutrition program."}
            </p>
          </section>

          {/* Section 2: What We Collect */}
          <section className="card-neon-glass p-6 sm:p-8 rounded-2xl">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-3">
              {isBn ? "২. আমরা কোন তথ্য সংগ্রহ করি" : "2. Information We Collect"}
            </h2>
            <p className="mb-4 text-[#94a3b8]">
              {isBn
                ? "অ্যাপের কার্যকারিতা ও আপনার ব্যক্তিগত ফিটনেস অগ্রগতি ট্র্যাক করার জন্য নিম্নলিখিত তথ্যগুলো ব্যবহৃত হয়:"
                : "To deliver workout tracking, calorie budgeting, and habit telemetry, our application processes the following data:"}
            </p>
            <ul className="space-y-2.5 list-disc list-inside text-xs sm:text-sm text-[#cbd5e1]">
              <li>
                <strong className="text-white">
                  {isBn ? "শারীরিক পরিমাপ ও সূচক:" : "Biometric Measurements:"}
                </strong>{" "}
                {isBn
                  ? "উচ্চতা (ফুট ও ইঞ্চি/সেমি) এবং শরীরের ওজন (কেজি)। এগুলো বিএমআই (BMI), দৈনিক ক্যালোরি ও পানির চাহিদা নির্ধারণে ব্যবহৃত হয়। (দ্রষ্টব্য: এই অ্যাপ ব্যবহারকারীর বয়স সংগ্রহ বা রেকর্ড করে না)।"
                  : "Height (feet/inches or cm) and body weight (kg), used to compute BMI and estimate calorie and hydration requirements. (Note: The app does not collect or store user age)."}
              </li>
              <li>
                <strong className="text-white">
                  {isBn ? "ফিটনেস লক্ষ্য ও স্তর:" : "Fitness Goals & Intensity Tiers:"}
                </strong>{" "}
                {isBn
                  ? "ওজন কমানো, ওজন বজায় রাখা, বা পেশি বৃদ্ধি; এবং ব্যায়ামের স্তর (Beginner, Intermediate, Advanced) ও স্থান (বাসা বনাম জিম)।"
                  : "Target goals (lose weight, maintain, build muscle/gain) and training levels (Beginner, Intermediate, Advanced) across home and gym environments."}
              </li>
              <li>
                <strong className="text-white">
                  {isBn ? "অ্যাকাউন্ট তথ্য (যদি সাইন-আপ করেন):" : "Account Credentials (Optional Registration):"}
                </strong>{" "}
                {isBn
                  ? "ইমেইল ঠিকানা, পাসওয়ার্ড এবং ঐচ্ছিক পূর্ণ নাম। আপনি চাইলে অ্যাকাউন্ট না খুলেও 'গেস্ট মোড'-এ অ্যাপের সব মৌলিক ফিচার ব্যবহার করতে পারেন।"
                  : "Email address, password, and optional display name. Users may also use the application in guest mode without creating an account."}
              </li>
              <li>
                <strong className="text-white">
                  {isBn ? "ওয়ার্কআউট ও পুষ্টি লগ:" : "Workout & Nutrition Logs:"}
                </strong>{" "}
                {isBn
                  ? "ব্যায়ামের নাম, সেট, রিপস, ওজন, সম্পন্ন করার স্ট্যাটাস, খাবারের নাম এবং ক্যালোরি/ম্যাক্রো (প্রোটিন, কার্ব, ফ্যাট)।"
                  : "Exercise names, completed sets, reps, load, meal entries, and macronutrient totals (protein, carbs, fat)."}
              </li>
              <li>
                <strong className="text-white">
                  {isBn ? "AI চ্যাট মেসেজ (সহকারী ফিচার ব্যবহার করলে):" : "AI Assistant Messages (If Used):"}
                </strong>{" "}
                {isBn
                  ? "AI ফিটনেস পরামর্শকের সাথে আপনার প্রেরিত বার্তা এবং কথোপকথনের ইতিহাস।"
                  : "User-submitted queries and dialogue history sent within the dynamic AI Fitness Assistant."}
              </li>
            </ul>
          </section>

          {/* Section 3: Why We Collect It */}
          <section className="card-neon-glass p-6 sm:p-8 rounded-2xl">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-3">
              {isBn ? "৩. আমরা কেন এই তথ্য সংগ্রহ করি" : "3. Why We Collect Your Data"}
            </h2>
            <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-[#94a3b8]">
              <li>{isBn ? "আপনার বিএমআই (BMI) ও স্বাস্থ্য সূচক সঠিকভাবে গণনা করতে।" : "To compute accurate BMI classification and health metrics."}</li>
              <li>{isBn ? "আপনার প্রোগ্রেসিভ ওভারলোড ওয়ার্কআউট ও দৈনিক পানির স্ট্রিক ট্র্যাক রাখতে।" : "To track progressive overload exercise sets and daily hydration streaks."}</li>
              <li>{isBn ? "ম্যাক্রো পুষ্টি ও ক্যালোরির হিসাব প্রদর্শন করতে।" : "To calculate daily macronutrient intake and caloric balance."}</li>
              <li>{isBn ? "একাউন্টে লগইন করা থাকলে বিভিন্ন ডিভাইসের মধ্যে আপনার ডেটা সিঙ্ক করতে।" : "To synchronize your historical records across sessions when signed in."}</li>
              <li>{isBn ? "AI সহকারীর মাধ্যমে প্রাসঙ্গিক ফিটনেস ও পুষ্টি সম্পর্কিত প্রশ্নের উত্তর প্রদান করতে।" : "To generate contextual fitness and nutritional feedback through the AI assistant."}</li>
            </ul>
          </section>

          {/* Section 4: Where Data is Stored */}
          <section className="card-neon-glass p-6 sm:p-8 rounded-2xl">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-3">
              {isBn ? "৪. ডেটা কোথায় সংরক্ষিত হয়" : "4. Where Your Data is Stored"}
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#94a3b8]">
              <p>
                <strong className="text-white">
                  {isBn ? "১. ব্রাউজার লোকাল স্টোরেজ (localStorage):" : "1. Local Browser Storage (localStorage):"}
                </strong>{" "}
                {isBn
                  ? "গেস্ট ব্যবহারকারীদের সকল তথ্য এবং লগইন করা ব্যবহারকারীদের অফলাইন ক্যাশ আপনার নিজস্ব ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত থাকে। এটি আপনার নিজস্ব ডিভাইসে এনক্রিপ্ট ছাড়া সাধারণ ব্রাউজার স্টোরেজ হিসেবে থাকে।"
                  : "For guest users and client-side performance caching, records are stored directly inside your browser's unencrypted localStorage on your device."}
              </p>
              <p>
                <strong className="text-white">
                  {isBn ? "২. সুপাবেস ক্লাউড ডাটাবেজ (Supabase):" : "2. Supabase Cloud Database (PostgreSQL):"}
                </strong>{" "}
                {isBn
                  ? "ব্যবহারকারী একাউন্ট তৈরি করে লগইন করলে তাদের পুষ্টি, ব্যায়াম, বিএমআই ও মেট্রিক্স ক্লাউড ডাটাবেজে সংরক্ষিত হয় যাতে যেকোনো ডিভাইস থেকে লগইন করে পাওয়া যায়।"
                  : "When a user signs up or signs in, their data (nutrition logs, workout logs, BMI entries, daily metrics) is persisted in a Supabase PostgreSQL cloud database for multi-device sync."}
              </p>
              <p>
                <strong className="text-white">
                  {isBn ? "পাসওয়ার্ড নিরাপত্তা:" : "Password Security:"}
                </strong>{" "}
                {isBn
                  ? "পাসওয়ার্ড কখনই প্লেইন টেক্সট হিসেবে সংরক্ষণ করা হয় না। Supabase Auth স্ট্যান্ডার্ড ক্রিপ্টোগ্রাফিক হ্যাশিং ব্যবহার করে পাসওয়ার্ড প্রক্রিয়া করে।"
                  : "Passwords are never stored in plain text. Supabase Authentication cryptographically hashes all credentials securely on their auth infrastructure."}
              </p>
            </div>
          </section>

          {/* Section 5: Third-Party Services */}
          <section className="card-neon-glass p-6 sm:p-8 rounded-2xl">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-3">
              {isBn ? "৫. থার্ড-পার্টি সার্ভিস ও ডেটা শেয়ারিং" : "5. Third Parties & Data Sharing"}
            </h2>
            <p className="mb-4 text-[#94a3b8]">
              {isBn
                ? "আমরা বিজ্ঞাপনী কোনো ডেটা ব্রোকারের কাছে আপনার তথ্য বিক্রি বা শেয়ার করি না। শুধুমাত্র অ্যাপের সেবা পরিচালনার জন্য নিম্নলিখিত সেবাসমূহ ব্যবহৃত হয়:"
                : "We do not sell user data to advertising brokers. Data is processed solely through the following operational infrastructure:"}
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-[#cbd5e1]">
              <div className="p-3.5 rounded-xl bg-[rgba(7,9,14,0.6)] border border-[rgba(163,230,53,0.15)]">
                <span className="font-bold text-white block mb-1">Vercel (Hosting Provider)</span>
                <span className="text-[#94a3b8] text-xs">
                  {isBn
                    ? "ওয়েবসাইটটি Vercel-এ হোস্ট করা। সাইট ডেলিভারি ও নিরাপত্তার স্বার্থে Vercel প্রযুক্তিগত ডেটা যেমন আইপি (IP) ঠিকানা এবং রিকোয়েস্ট লগ প্রসেস করতে পারে।"
                    : "The web application is hosted on Vercel, which may process standard technical request metadata (such as IP addresses and server access logs) to deliver and protect the application."}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[rgba(7,9,14,0.6)] border border-[rgba(163,230,53,0.15)]">
                <span className="font-bold text-white block mb-1">Supabase (Database & Authentication)</span>
                <span className="text-[#94a3b8] text-xs">
                  {isBn
                    ? "নিবন্ধিত ব্যবহারকারীদের একাউন্ট প্রমাণীকরণ এবং ব্যক্তিগত ফিটনেস ডেটা সংরক্ষণে ব্যবহৃত হয়।"
                    : "Processes user registration, authentication tokens, and synced workout/nutrition/BMI database records."}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[rgba(7,9,14,0.6)] border border-[rgba(163,230,53,0.15)]">
                <span className="font-bold text-white block mb-1">Google Gemini API (AI Fitness Assistant)</span>
                <span className="text-[#94a3b8] text-xs block mb-2">
                  {isBn
                    ? "অ্যাপের AI অ্যাসিস্ট্যান্ট ফিচারটি ব্যবহার করার সময় ব্যবহারকারীর বার্তা, চ্যাট হিস্ট্রি, এবং সাম্প্রতিক ফিটনেস পরিমাপ (বিএমআই, ওজন, উচ্চতা, লক্ষ্য, ক্যালোরি ও পানি টার্গেট) Google Gemini API-তে পাঠানো হয় উত্তর তৈরির জন্য। এতে কোনো ইমেইল বা পাসওয়ার্ড পাঠানো হয় না।"
                    : "When you use the AI Assistant, your query, conversation context, and latest telemetry (BMI, weight, height, goal category, calorie target, water target) are transmitted to the Google Gemini API to generate the response. No passwords or account credentials are transmitted."}
                </span>
                <span className="text-[11px] font-mono text-[#ccff00]">
                  Google Privacy Policy: [PLACEHOLDER — Google Privacy Policy URL]
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[rgba(7,9,14,0.6)] border border-[rgba(163,230,53,0.15)]">
                <span className="font-bold text-white block mb-1">Google Fonts & Unsplash Images</span>
                <span className="text-[#94a3b8] text-xs">
                  {isBn
                    ? "ওয়েবসাইট ফন্ট প্রদর্শনের জন্য Google Fonts (Geist) এবং ব্যায়ামের ফটোগ্রাফি প্রদর্শনের জন্য Unsplash ইমেজ সিডিএন ব্যবহার করা হয়।"
                    : "Web fonts are served via Google Fonts (Geist) and exercise photography is served from Unsplash CDN."}
                </span>
              </div>

              <div className="text-xs text-[#94a3b8] italic">
                {isBn
                  ? "অ্যাপটিতে কোনো ট্র্যাকিং কুকিজ, গুগল অ্যানালিটিক্স, ফেসবুক পিক্সেল বা বিজ্ঞাপন ট্র্যাকার নেই।"
                  : "The application uses no analytics suites (no Google Analytics, no Meta Pixel), no third-party marketing cookies, and no tracking scripts."}
              </div>
            </div>
          </section>

          {/* Section 6: How to Delete Your Data */}
          <section className="card-neon-glass p-6 sm:p-8 rounded-2xl">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-3">
              {isBn ? "৬. আপনার ডেটা মুছে ফেলার পদ্ধতি" : "6. How to Delete Your Data"}
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#94a3b8]">
              <p>
                <strong className="text-white">
                  {isBn ? "গেস্ট ডেটা (ব্রাউজারে সংরক্ষিত):" : "Guest / Local Browser Data:"}
                </strong>{" "}
                {isBn
                  ? "যেহেতু ডেটা আপনার নিজস্ব ব্রাউজারে সংরক্ষিত, তাই ব্রাউজারের সেটিংস থেকে 'Clear Browsing Data' বা 'Site Data' পরিষ্কার করলে তাৎক্ষণিকভাবে সমস্ত তথ্য মুছে যাবে।"
                  : "You can permanently delete all local records at any time by clearing your browser cache/cookies or clearing localStorage for this site."}
              </p>
              <p>
                <strong className="text-white">
                  {isBn ? "লগইন একাউন্ট ডেটা:" : "Registered Cloud Account Data:"}
                </strong>{" "}
                {isBn
                  ? "আপনি অ্যাপের ড্যাশবোর্ড থেকে আপনার ব্যক্তিগত খাবার ও ওয়ার্কআউট লগ সরাসরি ডিলিট করতে পারেন। সম্পূর্ণ একাউন্ট ও ক্লাউড ডেটা মুছে ফেলতে চাইলে নিচে প্রদত্ত ইমেইলে যোগাযোগ করুন।"
                  : "Users can delete individual logs directly within the app interface. To request full deletion of your registered account and database rows, please email us directly."}
              </p>
            </div>
          </section>

          {/* Section 7: Minimum Age */}
          <section className="card-neon-glass p-6 sm:p-8 rounded-2xl">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-3">
              {isBn ? "৭. বয়স সংক্রান্ত নীতিমালা" : "7. Minimum Age Requirement"}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mb-2">
              {isBn
                ? "আমাদের প্ল্যাটফর্মের সেবা গ্রহণের জন্য ন্যূনতম বয়সের শর্ত:"
                : "The minimum age requirement to use this platform:"}
            </p>
            <div className="inline-block px-3 py-1.5 rounded-lg bg-[rgba(7,9,14,0.7)] border border-[rgba(163,230,53,0.3)] text-xs font-mono text-[#ccff00]">
              [PLACEHOLDER — Minimum age requirement to be decided by owner]
            </div>
          </section>

          {/* Section 8: Contact Information */}
          <section className="card-neon-glass p-6 sm:p-8 rounded-2xl">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-3">
              {isBn ? "৮. যোগাযোগ" : "8. Contact Information"}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mb-3">
              {isBn
                ? "গোপনীয়তা নীতিমালা বা ডেটা সংক্রান্ত কোনো প্রশ্ন থাকলে সরাসরি ইমেইল করুন:"
                : "If you have any questions or data requests regarding this Privacy Policy, please contact:"}
            </p>
            <a
              href="mailto:khansiam01608@gmail.com"
              className="text-base font-mono font-bold text-[#ccff00] hover:underline"
            >
              khansiam01608@gmail.com
            </a>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
