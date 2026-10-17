"use client";

import { useState } from "react";
import RestTimer from "./RestTimer";

export type WorkoutLocation = "home" | "gym";
export type WorkoutLevel = "beginner" | "intermediate" | "advanced";

interface Exercise {
  id: string;
  nameBn: string;
  nameEn: string;
  tag: string;
  tagColor: string;
  target: string;
  instructions: string;
  tip: string;
  durationOrReps: string;
  imageUrl: string;
  formCue: string;
  formDescription: string;
  customGraphic?: "jumping-jacks" | "bodyweight-squat";
}

const EXERCISES_DATA: Record<
  WorkoutLevel,
  {
    titleBn: string;
    titleEn: string;
    badge: string;
    color: string;
    duration: string;
    exercises: Exercise[];
  }
> = {
  beginner: {
    titleBn: "বেসিক (Beginner)",
    titleEn: "Beginner Bodyweight Routine",
    badge: "🟢 লেভেল ১",
    color: "#22c55e",
    duration: "১৫-২০ মিনিট • কোনো সরঞ্জাম প্রয়োজন নেই",
    exercises: [
      {
        id: "b1",
        nameBn: "জাম্পিং জ্যাকস",
        nameEn: "Jumping Jacks",
        tag: "ওয়ার্মআপ ও কার্ডিও",
        tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        target: "🎯 পুরো শরীর, হৃদস্পন্দন ও রক্ত সঞ্চালন বৃদ্ধি",
        instructions:
          "📋 সোজা হয়ে দাঁড়ান, একসাথে লাফ দিয়ে পা দুদিকে ছড়ান এবং হাত মাথার উপরে তুলুন। শুরুতে আরামদায়ক ছন্দে করুন।",
        tip: "💡 হালকা পায়ের আঙুলের ওপর ভর দিয়ে সফট ল্যান্ডিং করুন।",
        durationOrReps: "৩০ সেকেন্ড x ২-৩ সেট",
        imageUrl: "",
        formCue: "📐 স্টার-জাম্প ভঙ্গিমা: পা দুদিকে ও হাত মাথার ওপর",
        formDescription: "2-step guide: পদক্ষেপ ১: শুরু (সোজা দাঁড়ানো) to পদক্ষেপ ২: লাফ (স্টার-জাম্প)",
        customGraphic: "jumping-jacks",
      },
      {
        id: "b2",
        nameBn: "বডিওয়েট স্কোয়াট",
        nameEn: "Bodyweight Squat",
        tag: "লোয়ার বডি",
        tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        target: "🎯 কোয়াড্রিসেপস, হ্যামস্ট্রিংস এবং গ্লুটস",
        instructions:
          "📋 পা কাঁধের সমান চওড়া রাখুন, বুক সোজা রেখে চেয়ারে বসার মতো নিতম্ব নিচে নামান। ঊরু মেঝের সমান্তরাল হলে আবার দাঁড়ান।",
        tip: "💡 হাঁটু যেন পায়ের পাতার বাইরে না যায় এবং গোড়ালি মাটিতে স্থির রাখুন।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 সঠিক স্কোয়াট: নিতম্ব পেছনে, ঊরু সমান্তরাল (৯০°)",
        formDescription: "2-step guide: পদক্ষেপ ১: শুরু (স্বাভাবিক অবস্থান) to পদক্ষেপ ২: স্কোয়াট (৯০° মেঝের সমান্তরাল)",
        customGraphic: "bodyweight-squat",
      },
      {
        id: "b3",
        nameBn: "হাঁটুতে পুশ-আপ (নি পুশ-আপ)",
        nameEn: "Knee / Wall Push-up",
        tag: "আপার বডি প্রেস",
        tagColor: "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20",
        target: "🎯 বুক, সামনের কাঁধ এবং ট্রাইসেপস",
        instructions:
          "📋 মেঝেতে হাঁটু গেড়ে শরীর মাথা থেকে হাঁটু পর্যন্ত সোজা তির্যক রেখায় রেখে বুক নিচে নামান ও নিয়ন্ত্রিতভাবে পুশ করুন।",
        tip: "💡 কনুই শরীরের সাথে প্রায় ৪৫ ডিগ্রি কোণে রাখুন, পিঠ সোজা রাখুন।",
        durationOrReps: "৮-১০ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 নি পুশ-আপ: হাঁটু মাটিতে, শরীর সোজা তির্যক রেখায়",
        formDescription: "Knees on mat, body in straight diagonal line, chest dropping",
      },
      {
        id: "b4",
        nameBn: "গ্লুট ব্রিজ",
        nameEn: "Glute Bridge",
        tag: "পোস্টেরিয়র চেইন",
        tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        target: "🎯 গ্লুটস, লোয়ার ব্যাক ও পেলভিক স্টেবিলিটি",
        instructions:
          "📋 পিঠের ওপর শুয়ে হাঁটু ভাঁজ করে পা মাটিতে রাখুন। নিতম্ব ওপরের দিকে ঠেলে ২ সেকেন্ড হোল্ড করে নামান।",
        tip: "💡 ওপরে ওঠার সময় পেটের পেশী শক্ত রাখুন এবং অতিরিক্ত পিঠ বাঁকাবেন না।",
        durationOrReps: "১২-১৫ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 ব্রিজ পজিশন: পিঠ ফ্ল্যাট, নিতম্ব সোজা উঁচুতে লক",
        formDescription: "Lie on back, knees bent, hips raised high",
      },
      {
        id: "b5",
        nameBn: "প্ল্যাঙ্ক (১০-২০ সেকেন্ড)",
        nameEn: "Standard Forearm Plank",
        tag: "কোর স্টেবিলিটি",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 সম্পূর্ণ কোর, পেটের গভীর পেশী ও পিঠের সুরক্ষা",
        instructions:
          "📋 কনুই ও পায়ের আঙুলের ওপর ভর দিয়ে শরীর মাথা থেকে গোড়ালি পর্যন্ত একদম সোজা রেখায় টানটান ধরে রাখুন।",
        tip: "💡 শ্বাস স্বাভাবিক রাখুন, নিতম্ব বেশি ওপরে তুলবেন না বা ঝুলিয়ে দেবেন না।",
        durationOrReps: "১৫-২০ সেকেন্ড x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 পারফেক্ট প্ল্যাঙ্ক: কনুই ও আঙুলে ভর, সোজা ফ্ল্যাট ব্যাক",
        formDescription: "Forearms and toes on ground, flat back and core tight",
      },
      {
        id: "b6",
        nameBn: "কুলডাউন স্ট্রেচিং",
        nameEn: "15-min Routine Stretching",
        tag: "রিকভারি ও ফ্লেক্সিবিলিটি",
        tagColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
        target: "🎯 সারা শরীরের নমনীয়তা ও পেশীর ক্লান্তি দূর করা",
        instructions:
          "📋 কোয়াডস, হ্যামস্ট্রিং, বুক ও পিঠের প্রতিটি স্ট্রেচ ১৫-২০ সেকেন্ড শান্তভাবে ধরে রাখুন।",
        tip: "💡 কোনো ঝাঁকুনি দেবেন না, আরামদায়ক মৃদু টান পর্যন্ত রাখুন।",
        durationOrReps: "৩-৫ মিনিট",
        imageUrl:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 স্ট্রেচ রিকভারি: ডিপ নিঃশ্বাসে পেশীর প্রসারণ",
        formDescription: "Full body post-workout gentle stretch routine",
      },
    ],
  },
  intermediate: {
    titleBn: "মিডিয়াম (Intermediate)",
    titleEn: "Intermediate Bodyweight Routine",
    badge: "🟡 লেভেল ২",
    color: "#eab308",
    duration: "২০-২৫ মিনিট • উন্নত ফর্ম ও স্ট্যামিনা",
    exercises: [
      {
        id: "i1",
        nameBn: "স্ট্যান্ডার্ড পুশ-আপ",
        nameEn: "Standard Push-up",
        tag: "আপার বডি প্রেস",
        tagColor: "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20",
        target: "🎯 বুক, ট্রাইসেপস ও সামনের কাঁধের পেশী",
        instructions:
          "📋 হাত কাঁধের সমান দূরত্বে মাটিতে রেখে শরীর সোজা রাখুন। বুক মেঝের প্রায় স্পর্শ করা পর্যন্ত নামিয়ে নিয়ন্ত্রিতভাবে পুশ করুন।",
        tip: "💡 কোর শক্ত রাখুন যাতে কোমর নিচে ঝুলে না যায়।",
        durationOrReps: "১০-১৫ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 ফুল পুশ-আপ: পায়ের আঙুলে সোজা প্ল্যাঙ্ক ও ডিপ প্রেস",
        formDescription: "Perfect plank pose on toes, lowering the body",
      },
      {
        id: "i2",
        nameBn: "অল্টারনেটিং লাঞ্জেস",
        nameEn: "Walking / Alternating Lunges",
        tag: "লোয়ার বডি",
        tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        target: "🎯 কোয়াডস, হ্যামস্ট্রিংস ও ভারসাম্য রক্ষা",
        instructions:
          "📋 বড় পদক্ষেপে এক পা সামনে এগিয়ে উভয় হাঁটু ৯০ ডিগ্রি কোণে বাঁকান। পেছনের হাঁটু মেঝের কাছাকাছি এনে ফিরে আসুন।",
        tip: "💡 সামনের হাঁটু যেন বুড়ো আঙুল অতিক্রম না করে।",
        durationOrReps: "১০ রেপস প্রতি পায়ে x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 লাঞ্জেস ফর্ম: সামনে বড় স্টেপ, পেছনের হাঁটু মেঝের কাছে",
        formDescription: "Big step forward, back knee hovering just off the ground",
      },
      {
        id: "i3",
        nameBn: "বাইসাইকেল ক্রাঞ্চ",
        nameEn: "Bicycle Crunch",
        tag: "অ্যাবডমিনালস",
        tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        target: "🎯 পেটের উপরিভাগ ও পাশের ওবলিক পেশী",
        instructions:
          "📋 পিঠে শুয়ে হাত মাথার পেছনে রাখুন। এক হাঁটু বুকের কাছে এনে বিপরীত কনুই তার কাছে আনুন এবং পর্যায়ক্রমে ঘোরান।",
        tip: "💡 ঘাড়ে টানবেন না, কোর দিয়ে কাঁধ ওপরে তুলুন।",
        durationOrReps: "১৫-২০ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 ক্রাঞ্চ টুইস্ট: পিঠ ফ্ল্যাট, বিপরীত কনুই ও হাঁটু একত্রিত",
        formDescription: "Lie flat, twist elbow to opposite knee",
      },
      {
        id: "i4",
        nameBn: "মাউন্টেন ক্লাইম্বার্স",
        nameEn: "Mountain Climbers",
        tag: "কোর ও কার্ডিও",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 কোর পেশী, কাঁধের সহনশীলতা ও চর্বি পোড়ানো",
        instructions:
          "📋 হাই প্ল্যাঙ্ক পজিশনে থাকুন। দ্রুত পর্যায়ক্রমে একটি করে হাঁটু বুকের দিকে টেনে আনুন যেন পাহাড়ে উঠছেন।",
        tip: "💡 হাত কাঁধের নিচে দৃঢ় রাখুন এবং পিঠ সোজা রাখুন।",
        durationOrReps: "৩০-৪০ সেকেন্ড x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 মাউন্টেন ড্রাইভ: হাই প্ল্যাঙ্ক, দ্রুত হাঁটু বুকের দিকে",
        formDescription: "High plank, knees driving aggressively towards chest",
      },
      {
        id: "i5",
        nameBn: "স্টেপ-ব্যাক লাঞ্জেস",
        nameEn: "Step-back Reverse Lunges",
        tag: "হিপ ও গ্লুট ড্রাইভ",
        tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        target: "🎯 গ্লুটস ও হ্যামস্ট্রিংস (হাঁটু-বান্ধব ব্যায়াম)",
        instructions:
          "📋 সোজা দাঁড়িয়ে এক পা পেছনের দিকে নিয়ে শরীর নামান। এটি হাঁটুর ওপর বাড়তি চাপ ছাড়া গ্লুটস সক্রিয় করে।",
        tip: "💡 সামনের পায়ের গোড়ালিতে ভর রেখে ওপরে উঠুন।",
        durationOrReps: "১০-১২ রেপস প্রতি পায়ে x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 রিভার্স লাঞ্জ: পেছনের পা নামিয়ে নিয়ন্ত্রিত লোয়ার",
        formDescription: "Step backward with one leg, lower hips smoothly",
      },
    ],
  },
  advanced: {
    titleBn: "হার্ড (Advanced)",
    titleEn: "Advanced Bodyweight Power",
    badge: "🔴 লেভেল ৩",
    color: "#ef4444",
    duration: "২৫-৩০ মিনিট • সর্বোচ্চ শক্তি ও ক্যালরি বার্ন",
    exercises: [
      {
        id: "a1",
        nameBn: "পাইক পুশ-আপ",
        nameEn: "Pike Push-ups",
        tag: "শোল্ডার প্রেস",
        tagColor: "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20",
        target: "🎯 কাঁধের পেশী (ডেল্টয়েড) ও ট্রাইসেপস",
        instructions:
          "📋 শরীর উল্টো 'V' আকারে কোমর উঁচুতে রেখে মাথা দুই হাতের মাঝখানে মেঝের দিকে নামান এবং চাপ দিয়ে ওপরে তুলুন।",
        tip: "💡 চোখ পায়ের দিকে রাখুন এবং কোর শক্ত রাখুন।",
        durationOrReps: "৮-১২ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 পাইক শেপ: কোমর উল্টো 'V' আকারে, মাথা মেঝের দিকে পুশ",
        formDescription: "Hips high in 'V' shape, head pointing toward ground",
      },
      {
        id: "a2",
        nameBn: "ফুল বার্পি",
        nameEn: "Full Burpees with Push-up & Jump",
        tag: "ফুল বডি পাওয়ার",
        tagColor: "bg-red-500/10 text-red-400 border-red-500/20",
        target: "🎯 সম্পূর্ণ শরীর ও দ্রুত ক্যালরি বার্ন",
        instructions:
          "📋 স্কোয়াট করে হাত মাটিতে রাখুন, পা পেছনে ছুড়ে পুশ-আপ করুন, আবার পা ফিরিয়ে এনে ওপরে হাত তুলে লাফ দিন।",
        tip: "💡 গতি ও নিয়ন্ত্রণের মধ্যে ভারসাম্য বজায় রাখুন।",
        durationOrReps: "১০-১৫ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 বার্পি সিকোয়েন্স: ডিপ স্কোয়াট ➔ প্ল্যাঙ্ক ➔ পুশ ➔ জাম্প",
        formDescription: "Deep squat to plank, push-up, jump back in, jump up",
      },
      {
        id: "a3",
        nameBn: "বেয়ার ক্রল",
        nameEn: "Bear Crawl",
        tag: "ফাংশনাল কোর",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 কোর স্ট্যাবিলিটি, কাঁধ ও কোঅর্ডিনেশন",
        instructions:
          "📋 হাত ও পায়ের আঙুলে ভর দিয়ে হাঁটু মাটির মাত্র ১-২ ইঞ্চি ওপরে রেখে চার পায়ে নিঃশব্দে সামনে ও পেছনে হাঁটুন।",
        tip: "💡 পিঠ একদম সমতল রাখুন, কোমর দোলাবেন না।",
        durationOrReps: "৩০-৪৫ সেকেন্ড x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 বেয়ার ক্রল: হাত ও আঙুলে ভর, হাঁটু মেঝের সামান্য ওপরে",
        formDescription: "Hands and toes, knees bent hovering off the floor",
      },
      {
        id: "a4",
        nameBn: "ইঞ্চিওয়ার্ম",
        nameEn: "Inchworm Walkouts",
        tag: "মোবিলিটি ও কোর",
        tagColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
        target: "🎯 হ্যামস্ট্রিং স্ট্রেচ, কোর ও শোল্ডার স্ট্যাবিলিটি",
        instructions:
          "📋 সোজা দাঁড়িয়ে হাত মাটিতে নামিয়ে হেঁটে হেঁটে প্ল্যাঙ্ক পজিশনে যান, ২ সেকেন্ড হোল্ড করে আবার হাত পিছিয়ে উঠে দাঁড়ান।",
        tip: "💡 পা যতদূর সম্ভব সোজা রাখার চেষ্টা করুন।",
        durationOrReps: "৮-১০ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 ইঞ্চিওয়ার্ম: হাত হেঁটে প্ল্যাঙ্কে যান ও আবার উঠে দাঁড়ান",
        formDescription: "Walk hands out to plank, walk feet back to hands",
      },
      {
        id: "a5",
        nameBn: "জাম্প স্কোয়াট",
        nameEn: "Explosive Jump Squats",
        tag: "প্লায়োমেট্রিক্স",
        tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        target: "🎯 এক্সপ্লোসিভ লেগ পাওয়ার ও ক্যালরি বার্ন",
        instructions:
          "📋 সাধারণ স্কোয়াট পজিশনে নেমে সর্বোচ্চ শক্তিতে ওপরে লাফ দিন এবং কোমলভাবে আবার স্কোয়াটে নামুন।",
        tip: "💡 ল্যান্ডিংয়ের সময় হাঁটু আলতো করে ভাঁজ করে শক অ্যাবসর্ব করুন।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 জাম্প স্কোয়াট: ডিপ স্কোয়াট থেকে এক্সপ্লোসিভ উল্লম্ফন",
        formDescription: "Explosive vertical jump from deep squat position",
      },
    ],
  },
};

function JumpingJacksTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="jjBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#065f46" stopOpacity="0.45" />
          <stop offset="1" stopColor="#047857" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="jjTorso1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="jjTorso2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#jjBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (START) ================= */}
      {/* Step Badge */}
      <rect x="25" y="16" width="125" height="26" rx="13" fill="#065f46" fillOpacity="0.35" stroke="#10b981" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#34d399" />
      <text x="48" y="33" fill="#6ee7b7" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Yoga Mat */}
      <ellipse cx="150" cy="256" rx="90" ry="12" fill="url(#matGrad1)" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" />

      {/* Human Figure: Standing upright, feet together, arms relaxed */}
      <g transform="translate(150, 72)">
        {/* Head */}
        <circle cx="0" cy="16" r="13" fill="#cbd5e1" />
        {/* Neck */}
        <line x1="0" y1="29" x2="0" y2="38" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        {/* Torso: Upright neutral spine */}
        <path d="M-15 42 Q0 38 15 42 L11 102 Q0 105 -11 102 Z" fill="url(#jjTorso1)" />
        {/* Relaxed Arms down alongside body */}
        <path d="M-15 45 L-22 90 L-21 115" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 45 L22 90 L21 115" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        {/* Shorts */}
        <path d="M-12 102 L12 102 L14 122 L-14 122 Z" fill="#0f172a" />
        {/* Legs: Straight, feet together */}
        <line x1="-6" y1="122" x2="-6" y2="182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <line x1="6" y1="122" x2="6" y2="182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        {/* Feet: Resting together on mat */}
        <ellipse cx="-7" cy="183" rx="8" ry="4" fill="#0284c7" />
        <ellipse cx="7" cy="183" rx="8" ry="4" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        সোজা হয়ে দাঁড়ান, হাত পাশে ও পা একত্র
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (STAR JUMP) ================= */}
      {/* Step Badge */}
      <rect x="325" y="16" width="125" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: লাফ
      </text>

      {/* Yoga Mat */}
      <ellipse cx="450" cy="256" rx="100" ry="13" fill="url(#matGrad1)" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" />

      {/* Dynamic Motion Arcs */}
      <path d="M375 125 C365 90 385 55 415 40" stroke="#ccff00" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.75" />
      <path d="M525 125 C535 90 515 55 485 40" stroke="#ccff00" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.75" />
      <ellipse cx="450" cy="250" rx="42" ry="6" stroke="#ccff00" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />

      {/* Human Figure: Star Jump (wide legs, arms up in high V-shape) */}
      <g transform="translate(450, 60)">
        {/* Head */}
        <circle cx="0" cy="16" r="13" fill="#f8fafc" />
        {/* Neck */}
        <line x1="0" y1="29" x2="0" y2="38" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        {/* Torso */}
        <path d="M-15 42 Q0 38 15 42 L12 102 Q0 105 -12 102 Z" fill="url(#jjTorso2)" />
        {/* Arms: Extended overhead in dynamic V-shape */}
        <path d="M-15 42 L-42 16 L-62 -12" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 42 L42 16 L62 -12" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        {/* Shorts */}
        <path d="M-13 102 L13 102 L16 123 L-16 123 Z" fill="#0f172a" />
        {/* Legs: Spread wide in star posture */}
        <line x1="-8" y1="123" x2="-38" y2="183" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <line x1="8" y1="123" x2="38" y2="183" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        {/* Feet: Soft landing on mat */}
        <ellipse cx="-40" cy="184" rx="9" ry="4" fill="#65a30d" transform="rotate(-15 -40 184)" />
        <ellipse cx="40" cy="184" rx="9" ry="4" fill="#65a30d" transform="rotate(15 40 184)" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        লাফ দিয়ে পা দুদিকে ও দুই হাত মাথার ওপর V-আকারে
      </text>
    </svg>
  );
}

function SquatTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="sqBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradBlue" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#1e3a8a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="sqTorso1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="sqTorso2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#sqBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (START) ================= */}
      {/* Step Badge */}
      <rect x="25" y="16" width="125" height="26" rx="13" fill="#1e3a8a" fillOpacity="0.35" stroke="#3b82f6" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#60a5fa" />
      <text x="48" y="33" fill="#93c5fd" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Floor Mat Marker */}
      <ellipse cx="150" cy="256" rx="85" ry="12" fill="url(#matGradBlue)" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />

      {/* Human Figure: Standing naturally with shoulder-width stance */}
      <g transform="translate(150, 72)">
        {/* Head */}
        <circle cx="0" cy="16" r="13" fill="#cbd5e1" />
        {/* Neck */}
        <line x1="0" y1="29" x2="0" y2="38" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        {/* Torso upright */}
        <path d="M-15 42 Q0 38 15 42 L12 102 Q0 105 -12 102 Z" fill="url(#sqTorso1)" />
        {/* Arms: Forward ready stance */}
        <path d="M-14 45 L-10 82 L10 85" stroke="#cbd5e1" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 45 L18 82 L2 85" stroke="#cbd5e1" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Shorts */}
        <path d="M-13 102 L13 102 L15 122 L-15 122 Z" fill="#0f172a" />
        {/* Legs: Shoulder-width stance */}
        <line x1="-10" y1="122" x2="-14" y2="182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <line x1="10" y1="122" x2="14" y2="182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        {/* Feet: Flat on ground */}
        <ellipse cx="-16" cy="183" rx="9" ry="4" fill="#0284c7" />
        <ellipse cx="16" cy="183" rx="9" ry="4" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        পা কাঁধ বরাবর চওড়া, বুক সোজা ও চোখ সামনে
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (AIR SQUAT 90°) ================= */}
      {/* Step Badge */}
      <rect x="325" y="16" width="140" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: স্কোয়াট
      </text>

      {/* Floor Mat Marker */}
      <ellipse cx="450" cy="256" rx="95" ry="12" fill="url(#matGradBlue)" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />

      {/* 90° Parallel Thigh Guideline Indicator */}
      <line x1="385" y1="205" x2="480" y2="205" stroke="#ccff00" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.85" />
      <rect x="375" y="212" width="60" height="18" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="405" y="225" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৯০° সমান্তরাল
      </text>

      {/* Downward Hip Movement Indicator Arc */}
      <path d="M485 140 C495 160 490 185 475 200" stroke="#ccff00" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.75" />
      <polygon points="472,202 480,200 476,193" fill="#ccff00" opacity="0.85" />

      {/* Human Figure: Deep Air Squat without any bar or rack */}
      <g transform="translate(435, 110)">
        {/* Head */}
        <circle cx="0" cy="15" r="13" fill="#f8fafc" />
        {/* Neck */}
        <line x1="0" y1="28" x2="3" y2="36" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        {/* Torso: Natural inclined angle (~45 deg) */}
        <path d="M-8 40 L16 38 L25 90 L-4 92 Z" fill="url(#sqTorso2)" />
        {/* Arms: Stretched straight outward for counterbalance and stability */}
        <line x1="12" y1="48" x2="-48" y2="52" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
        {/* Shorts: Hips seated back */}
        <path d="M-5 92 L25 90 L38 108 L10 112 Z" fill="#0f172a" />
        {/* Thighs: Parallel to floor (Hips back, thighs horizontal at 90°) */}
        <line x1="28" y1="98" x2="-18" y2="98" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
        {/* Shins: Stable angle, knees over toes */}
        <line x1="-18" y1="98" x2="-12" y2="150" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        {/* Feet: Flat on ground */}
        <ellipse cx="-18" cy="151" rx="12" ry="4.5" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        নিতম্ব পেছনে চেয়ারের মতো নামান, ঊরু মেঝের সমান্তরাল (৯০°)
      </text>
    </svg>
  );
}

export default function WorkoutFlow() {
  const [step, setStep] = useState<"location" | "level" | "exercises" | "gym">("location");
  const [location, setLocation] = useState<WorkoutLocation>("home");
  const [level, setLevel] = useState<WorkoutLevel>("beginner");
  const [showTimer, setShowTimer] = useState<boolean>(true);

  const handleSelectLocation = (loc: WorkoutLocation) => {
    setLocation(loc);
    if (loc === "home") {
      setStep("level");
    } else {
      setStep("gym");
    }
  };

  const handleSelectLevel = (lvl: WorkoutLevel) => {
    setLevel(lvl);
    setStep("exercises");
  };

  const activeLevelData = EXERCISES_DATA[level];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* STEP 1: Location Selection */}
      {step === "location" && (
        <div className="w-full max-w-md bg-[#0d131f] border border-slate-800 rounded-3xl p-6 flex flex-col items-center shadow-2xl text-slate-100 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📍</span>
            <h2 className="text-xl font-bold text-slate-200">
              আপনি কোথায় ব্যায়াম করতে চান?
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-6 text-center">
            আপনার ওয়ার্কআউট পরিবেশ নির্বাচন করুন
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            {/* Home Option */}
            <button
              type="button"
              onClick={() => handleSelectLocation("home")}
              className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-800 bg-[#121826]/80 hover:border-[#ccff00] hover:bg-[#121826] transition-all text-center group cursor-pointer active:scale-95 shadow-md"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                🏠
              </span>
              <span className="text-lg font-bold text-white group-hover:text-[#ccff00] transition-colors mb-1">
                বাসায়
              </span>
              <span className="text-xs text-slate-400">
                বডিওয়েট ও ফ্রি হ্যান্ড
              </span>
              <span className="mt-3 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 font-bold">
                কোনো সরঞ্জাম নেই
              </span>
            </button>

            {/* Gym Option */}
            <button
              type="button"
              onClick={() => handleSelectLocation("gym")}
              className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-800 bg-[#121826]/80 hover:border-[#ccff00] hover:bg-[#121826] transition-all text-center group cursor-pointer active:scale-95 shadow-md"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                🏋️
              </span>
              <span className="text-lg font-bold text-white group-hover:text-[#ccff00] transition-colors mb-1">
                জিম
              </span>
              <span className="text-xs text-slate-400">
                ওয়েটস ও মেশিন
              </span>
              <span className="mt-3 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold">
                সম্পূর্ণ ইকুইপমেন্ট
              </span>
            </button>
          </div>

          <div className="w-full flex justify-center">
            <RestTimer />
          </div>
        </div>
      )}

      {/* STEP 2: Level Selection (Home Workout) */}
      {step === "level" && (
        <div className="w-full max-w-lg bg-[#0d131f] border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col items-center shadow-2xl text-slate-100 animate-in fade-in duration-300">
          <div className="flex items-center justify-between w-full mb-4">
            <button
              type="button"
              onClick={() => setStep("location")}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition"
            >
              ← পেছনে যান
            </button>
            <span className="text-xs font-mono text-[#ccff00] px-2.5 py-1 rounded-md bg-[#ccff00]/10 border border-[#ccff00]/20 font-bold">
              🏠 হোম ওয়ার্কআউট
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-200 mb-1 text-center">
            কোন স্তর থেকে শুরু করতে চান?
          </h2>
          <p className="text-xs text-slate-400 mb-6 text-center">
            আপনার ফিটনেস লেভেল অনুযায়ী সেরা বডিওয়েট প্ল্যান বেছে নিন
          </p>

          <div className="flex flex-col gap-3 w-full mb-6">
            {/* Beginner */}
            <button
              type="button"
              onClick={() => handleSelectLevel("beginner")}
              className="p-4 rounded-2xl border border-slate-800 bg-[#121826]/70 hover:border-emerald-500 hover:bg-[#121826] transition-all text-left flex items-center justify-between group active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl shrink-0">
                  🟢
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                      ১. বেসিক (Beginner)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                      ১৫ মিনিট
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    জাম্পিং জ্যাকস, স্কোয়াট, ওয়াল/নি পুশ-আপ, গ্লুট ব্রিজ, প্ল্যাঙ্ক ও স্ট্রেচিং
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-white transition-colors ml-2">
                &rarr;
              </span>
            </button>

            {/* Intermediate */}
            <button
              type="button"
              onClick={() => handleSelectLevel("intermediate")}
              className="p-4 rounded-2xl border border-slate-800 bg-[#121826]/70 hover:border-amber-500 hover:bg-[#121826] transition-all text-left flex items-center justify-between group active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
                  🟡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                      ২. মিডিয়াম (Intermediate)
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded">
                      ২০ মিনিট
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    স্ট্যান্ডার্ড পুশ-আপ, লাঞ্জেস, বাইসাইকেল ক্রাঞ্চ, মাউন্টেন ক্লাইম্বার্স
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-white transition-colors ml-2">
                &rarr;
              </span>
            </button>

            {/* Advanced */}
            <button
              type="button"
              onClick={() => handleSelectLevel("advanced")}
              className="p-4 rounded-2xl border border-slate-800 bg-[#121826]/70 hover:border-red-500 hover:bg-[#121826] transition-all text-left flex items-center justify-between group active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl shrink-0">
                  🔴
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-red-400 transition-colors">
                      ৩. হার্ড (Advanced)
                    </span>
                    <span className="text-[10px] font-mono text-red-400 bg-red-500/15 px-2 py-0.5 rounded">
                      ২৫ মিনিট
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    পাইক পুশ-আপ, ফুল বার্পি, বেয়ার ক্রল, ইঞ্চিওয়ার্ম, জাম্প স্কোয়াট
                  </p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-white transition-colors ml-2">
                &rarr;
              </span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Exercise Cards Display (Active Workout) */}
      {step === "exercises" && (
        <div className="w-full flex flex-col items-center space-y-6 animate-in fade-in duration-300">
          {/* Top Bar with Navigation & Level Badge */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d131f] border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("level")}
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
              >
                ← লেভেল পরিবর্তন
              </button>
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeLevelData.titleBn}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {activeLevelData.duration}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTimer(!showTimer)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 hover:bg-[#ccff00]/25 transition"
            >
              ⏱️ {showTimer ? "টাইমার লুকান" : "রেস্ট টাইমার খুলুন"}
            </button>
          </div>

          {/* Toggleable Compact RestTimer */}
          {showTimer && (
            <div className="w-full flex justify-center animate-in fade-in duration-200">
              <RestTimer />
            </div>
          )}

          {/* Exercise Cards Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLevelData.exercises.map((ex, index) => (
              <div
                key={ex.id}
                className="bg-[#0d131f] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          #{index + 1}
                        </span>
                        <h4 className="text-base font-bold text-white">
                          {ex.nameBn}
                        </h4>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {ex.nameEn}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold font-mono uppercase px-2.5 py-0.5 rounded-full border ${ex.tagColor}`}
                    >
                      {ex.tag}
                    </span>
                  </div>

                  {/* Strictly Bounded Responsive Image Container */}
                  <div className="relative w-full h-44 sm:h-48 overflow-hidden rounded-xl bg-slate-900 border border-slate-800/80 mb-3.5 flex items-center justify-center">
                    {ex.customGraphic === "jumping-jacks" ? (
                      <JumpingJacksTwoStepGraphic />
                    ) : ex.customGraphic === "bodyweight-squat" ? (
                      <SquatTwoStepGraphic />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={ex.imageUrl}
                        alt={ex.formDescription}
                        className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    {/* Visual Form Indicator Overlay */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[10px] font-mono text-slate-200 border border-slate-700/80 max-w-[88%] truncate shadow">
                      {ex.formCue}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-sm text-[11px] font-mono text-[#ccff00] border border-slate-800 font-bold shadow">
                      {ex.durationOrReps}
                    </div>
                  </div>

                  {/* Details Description */}
                  <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                    <p className="leading-relaxed">
                      <span className="font-semibold text-slate-100">{ex.target}</span>
                    </p>
                    <p className="leading-relaxed text-slate-400">
                      {ex.instructions}
                    </p>
                    <p className="text-[11px] text-emerald-400/90 italic">
                      {ex.tip}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>সেট বিশ্রাম: ৩০-৬০ সেকেন্ড</span>
                  <span className="text-[#ccff00]">বডিওয়েট গাইড ✓</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Back Button */}
          <div className="pt-4 pb-8">
            <button
              type="button"
              onClick={() => setStep("level")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 shadow-md"
            >
              ← অন্য লেভেল নির্বাচন করুন
            </button>
          </div>
        </div>
      )}

      {/* Gym Option View */}
      {step === "gym" && (
        <div className="w-full max-w-lg bg-[#0d131f] border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col items-center shadow-2xl text-slate-100 animate-in fade-in duration-300">
          <div className="flex items-center justify-between w-full mb-4">
            <button
              type="button"
              onClick={() => setStep("location")}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition"
            >
              ← পেছনে যান
            </button>
            <span className="text-xs font-mono text-blue-400 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 font-bold">
              🏋️ জিম প্রোটোকল
            </span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl mb-3">
            🏋️
          </div>
          <h2 className="text-xl font-bold text-slate-200 mb-1 text-center">
            জিম ওয়ার্কআউট প্রোটোকল
          </h2>
          <p className="text-xs text-slate-400 mb-6 text-center max-w-sm">
            ভারী সরঞ্জাম ও ডাম্বেল/বারবেল ব্যবহারের পূর্বে সঠিক প্রস্তুতি ও নিরাপত্তা নিশ্চিত করুন
          </p>

          <div className="space-y-3 w-full mb-6">
            <div className="p-3.5 rounded-xl bg-[#121826] border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">১. সক্রিয় ওয়ার্মআপ:</span>
              ট্রেডমিল বা সাইকেলে ৫-১০ মিনিট হালকা কার্ডিও করে পেশীগুলো সচল করুন।
            </div>
            <div className="p-3.5 rounded-xl bg-[#121826] border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">২. প্রোগ্রেসিভ ওভারলোড:</span>
              হঠাৎ ভারী ওজন না তুলে সঠিক ফর্মে ধীরে ধীরে ওজন বৃদ্ধি করুন।
            </div>
            <div className="p-3.5 rounded-xl bg-[#121826] border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">৩. সেটের মাঝে বিশ্রাম:</span>
              কম্পাউন্ড এক্সারসাইজে ৯০-১২০ সেকেন্ড এবং আইসোলেশনে ৬০ সেকেন্ড রেস্ট নিন।
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setLocation("home");
                setStep("level");
              }}
              className="w-full py-3 rounded-xl font-bold bg-[#ccff00] text-black hover:opacity-90 transition active:scale-95 text-xs text-center shadow-lg shadow-[#ccff00]/10"
            >
              বাসায় বডিওয়েট ওয়ার্কআউট দেখুন &rarr;
            </button>
            <button
              type="button"
              onClick={() => setStep("location")}
              className="w-full py-2.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs border border-slate-700"
            >
              স্থান পরিবর্তন করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
