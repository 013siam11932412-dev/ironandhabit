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
  customGraphic?:
    | "jumping-jacks"
    | "bodyweight-squat"
    | "standard-pushup"
    | "reverse-lunge"
    | "chest-to-floor-burpees"
    | "diamond-pushup"
    | "jump-squats"
    | "hollow-body-hold"
    | "side-plank-hip-dips"
    | "knee-pushup"
    | "gym-goblet-squat"
    | "gym-bench-press"
    | "gym-lat-pulldown"
    | "gym-rdl"
    | "gym-shoulder-press"
    | "gym-barbell-squat"
    | "gym-barbell-bench-press"
    | "gym-bent-over-row"
    | "gym-incline-dumbbell-press"
    | "gym-leg-press"
    | "gym-barbell-deadlift"
    | "gym-overhead-press"
    | "gym-bulgarian-split-squat"
    | "gym-parallel-dips"
    | "gym-hip-thrust";
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
        nameBn: "জাম্পিং জ্যাকস (ওয়ার্মআপ ছন্দ)",
        nameEn: "Beginner Low-Impact Jumping Jacks",
        tag: "ওয়ার্মআপ ও কার্ডিও",
        tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        target: "🎯 পুরো শরীর, মৃদু কার্ডিও ও রক্ত সঞ্চালন বৃদ্ধি",
        instructions:
          "📋 সোজা হয়ে দাঁড়িয়ে আরামদায়ক ছন্দে লাফ দিয়ে পা দুদিকে ছড়ান এবং হাত মাথার ওপরে তুলুন। নতুনদের জন্য নিয়ন্ত্রিত গতি বজায় রাখুন।",
        tip: "💡 হালকা পায়ের পাতার ওপর সফট ল্যান্ডিং করুন; প্রয়োজনে না লাফিয়ে এক পা এক পা পাশে সরিয়ে স্টেপ-জ্যাকস করুন।",
        durationOrReps: "২০-৩০ সেকেন্ড x ২-৩ সেট",
        imageUrl: "",
        formCue: "📐 স্টার-জাম্প ভঙ্গিমা: পা দুদিকে ও হাত মাথার ওপর",
        formDescription: "2-step guide: পদক্ষেপ ১: শুরু (সোজা দাঁড়ানো) to পদক্ষেপ ২: লাফ (স্টার-জাম্প)",
        customGraphic: "jumping-jacks",
      },
      {
        id: "b2",
        nameBn: "বডিওয়েট এয়ার স্কোয়াট",
        nameEn: "Bodyweight Air Squat",
        tag: "লোয়ার বডি ফাউন্ডেশন",
        tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        target: "🎯 কোয়াড্রিসেপস, হ্যামস্ট্রিংস ও গ্লুটসের মৌলিক শক্তি",
        instructions:
          "📋 পা কাঁধের সমান দূরত্বে রাখুন, বুক টানটান রেখে একটি চেয়ারে বসার মতো নিতম্ব পেছনের দিকে নামান। ঊরু ৯০° সমান্তরাল হলে স্বাভাবিকভাবে দাঁড়ান।",
        tip: "💡 গোড়ালি মাটিতে স্থির রাখুন, হাঁটু যেন পায়ের পাতার বাইরে না যায় এবং পিঠ সোজা রাখুন।",
        durationOrReps: "৮-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 সঠিক স্কোয়াট: নিতম্ব পেছনে, ঊরু সমান্তরাল (৯০°)",
        formDescription: "2-step guide: পদক্ষেপ ১: শুরু (স্বাভাবিক অবস্থান) to পদক্ষেপ ২: স্কোয়াট (৯০° মেঝের সমান্তরাল)",
        customGraphic: "bodyweight-squat",
      },
      {
        id: "b3",
        nameBn: "ওয়াল / নি পুশ-আপ",
        nameEn: "Wall / Knee Push-up",
        tag: "আপার বডি ফাউন্ডেশন",
        tagColor: "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20",
        target: "🎯 বুক, ট্রাইসেপস ও সামনের কাঁধের পেশী (জিরো জয়েন্ট প্রেশার)",
        instructions:
          "📋 মেঝেতে হাঁটু গেড়ে (অথবা দেয়ালে হাত রেখে) শরীর মাথা থেকে হাঁটু পর্যন্ত সরলরেখায় রাখুন। বুক মেঝের কাছে নামিয়ে নিয়ন্ত্রিতভাবে ধাক্কা দিয়ে তুলুন।",
        tip: "💡 মেঝেতে কঠিন মনে হলে দেয়ালের সাহায্যে বা ইনক্লাইন সারফেসে শুরু করুন। কোমর ঝুলিয়ে দেবেন না।",
        durationOrReps: "৬-১০ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 নি পুশ-আপ: হাঁটু মাটিতে, শরীর সোজা তির্যক রেখায়",
        formDescription:
          "2-step guide: পদক্ষেপ ১: শুরু (নি-প্ল্যাঙ্ক) to পদক্ষেপ ২: পুশ-আপ (৯০° কনুই ফ্লেকশন)",
        customGraphic: "knee-pushup",
      },
      {
        id: "b4",
        nameBn: "ফ্লোর গ্লুট ব্রিজ",
        nameEn: "Floor Glute Bridge",
        tag: "পোস্টেরিয়র চেইন",
        tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        target: "🎯 গ্লুটস, লোয়ার ব্যাক ও পেলভিক স্টেবিলিটি",
        instructions:
          "📋 ম্যাটে পিঠের ওপর চিত হয়ে শুয়ে হাঁটু ভাঁজ করুন। গোড়ালিতে ভর রেখে নিতম্ব ওপরে তুলুন এবং শীর্ষে ১-২ সেকেন্ড সংকুচিত করে ধীরে নামান।",
        tip: "💡 পেট ও কোর শক্ত রাখুন, পিঠ অতিরিক্ত ধনুকের মতো বাঁকাবেন না।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 ব্রিজ পজিশন: পিঠ ফ্ল্যাট, নিতম্ব সোজা উঁচুতে লক",
        formDescription: "Lie on back, knees bent, hips raised high",
      },
      {
        id: "b5",
        nameBn: "বিগিনার নি / ফোরআর্ম প্ল্যাঙ্ক",
        nameEn: "Beginner Forearm / Knee Plank",
        tag: "কোর ফাউন্ডেশন",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 পেটের গভীর কোর পেশী ও মেরুদণ্ডের সুরক্ষা",
        instructions:
          "📋 কনুই ও হাঁটুর ওপর (অথবা পায়ের আঙুলে) ভর দিয়ে শরীর সোজা রেখায় টানটান রাখুন। পেটের পেশী ভেতরের দিকে টেনে স্থিরভাবে ধরে রাখুন।",
        tip: "💡 শ্বাস স্বাভাবিক রাখুন, নিতম্ব বেশি ওপরে তুলবেন না বা নিচে ঝুলিয়ে দেবেন না।",
        durationOrReps: "১০-২০ সেকেন্ড x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 বিগিনার প্ল্যাঙ্ক: কনুইয়ে ভর, সমান্তরাল ফ্ল্যাট ব্যাক",
        formDescription: "Forearms and knees/toes on ground, flat back and core tight",
      },
      {
        id: "b6",
        nameBn: "ফুল বডি কুলডাউন স্ট্রেচ",
        nameEn: "Full Body Cooldown Stretch",
        tag: "রিকভারি ও ফ্লেক্সিবিলিটি",
        tagColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
        target: "🎯 পেশীর ক্লান্তি ও টান দূর করা, রক্তসঞ্চালন স্বাভাবিক রাখা",
        instructions:
          "📋 কোয়াডস, হ্যামস্ট্রিং, বুক ও পিঠের প্রতিটি স্ট্রেচ শান্তভাবে ১৫-২০ সেকেন্ড মৃদু টানে ধরে রাখুন।",
        tip: "💡 কোনো ঝাঁকুনি দেবেন না, গভীর শ্বাস-প্রশ্বাসের মাধ্যমে শরীর সম্পূর্ণ রিল্যাক্স করুন।",
        durationOrReps: "৩-৫ মিনিট শান্ত স্ট্রেচ",
        imageUrl:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 স্ট্রেচ রিকভারি: ডিপ নিঃশ্বাসে পেশীর প্রসারণ ও স্বস্তি",
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
        nameBn: "হাই নিজ (ডাইনামিক কার্ডিও)",
        nameEn: "High Knees Running",
        tag: "ডাইনামিক কার্ডিও ও ওয়ার্মআপ",
        tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        target: "🎯 দ্রুত হৃদস্পন্দন বৃদ্ধি, কোর অ্যাক্টিভেশন ও ক্যালরি বার্ন",
        instructions:
          "📋 সোজা দাঁড়িয়ে ছন্দময় গতিতে একটি করে হাঁটু কোমরের উচ্চতায় দ্রুত তুলুন এবং দুই হাত স্বাভাবিকভাবে পাম্প করুন।",
        tip: "💡 পায়ের পাতার সামনের অংশে হালকা বাউন্স করুন এবং বুক খাড়া রাখুন।",
        durationOrReps: "৩০-৪৫ সেকেন্ড x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 হাই নিজ: হাঁটু কোমর পর্যন্ত তোলা ও রিদমিক আর্ম ড্রাইভ",
        formDescription: "High knees sprint in place with rhythmic arm movement",
      },
      {
        id: "i2",
        nameBn: "স্ট্যান্ডার্ড ফ্লোর পুশ-আপ",
        nameEn: "Standard Full Floor Push-up",
        tag: "আপার বডি প্রেস",
        tagColor: "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20",
        target: "🎯 বুক (চেস্ট), ট্রাইসেপস ও সামনের কাঁধের পেশী",
        instructions:
          "📋 পায়ের আঙুল ও হাতে ভর দিয়ে পুরো শরীর তক্তার মতো সোজা রাখুন। বুক মেঝের কাছাকাছি এনে শক্তিশালী চাপে ওপরে উঠুন।",
        tip: "💡 কনুই শরীরের সাথে প্রায় ৪৫ ডিগ্রি কোণে রাখুন, কোমর যেন নিচে ঝুলে না যায়।",
        durationOrReps: "১০-১৫ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 ফুল পুশ-আপ: পায়ের আঙুলে সোজা প্ল্যাঙ্ক, চেস্ট টু ফ্লোর",
        formDescription:
          "2-step guide: পদক্ষেপ ১: হাই প্ল্যাঙ্ক (শুরু) to পদক্ষেপ ২: লোয়ার পুশ (৯০° কনুই)",
        customGraphic: "standard-pushup",
      },
      {
        id: "i3",
        nameBn: "অল্টারনেটিং রিভার্স লাঞ্জেস",
        nameEn: "Alternating Reverse Lunges",
        tag: "লোয়ার বডি ও স্ট্যাবিলিটি",
        tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        target: "🎯 কোয়াডস, হ্যামস্ট্রিংস, গ্লুটস ও ব্যালান্স",
        instructions:
          "📋 সোজা দাঁড়িয়ে এক পা পেছনের দিকে বড় পদক্ষেপে নিন এবং উভয় হাঁটু ৯০° কোণে নামান। সামনের পায়ের গোড়ালিতে ভর দিয়ে ফিরে আসুন।",
        tip: "💡 পেছনের হাঁটু মেঝের কাছাকাছি আনুন কিন্তু মাটিতে আঘাত করবেন না; ধড় একদম সোজা রাখুন।",
        durationOrReps: "১০-১২ রেপস প্রতি পায়ে x ৩ সেট",
        imageUrl: "",
        formCue: "📐 রিভার্স লাঞ্জ: পেছনের হাঁটু ৯০° মেঝের কাছে, ধড় খাড়া",
        formDescription:
          "2-step guide: পদক্ষেপ ১: শুরু (সোজা দাঁড়ানো) to পদক্ষেপ ২: রিভার্স লাঞ্জ (উভয় হাঁটু ৯০°)",
        customGraphic: "reverse-lunge",
      },
      {
        id: "i4",
        nameBn: "বাইসাইকেল ক্রাঞ্চ",
        nameEn: "Bicycle Crunches",
        tag: "অ্যাবডমিনালস ও ওবলিক",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 সম্পূর্ণ কোর, পেটের উপরিভাগ ও পাশের ওবলিক পেশী",
        instructions:
          "📋 পিঠে শুয়ে হাত আলতো করে কানের পাশে রাখুন। এক হাঁটু বুকের কাছে এনে বিপরীত কনুই তার কাছে আনুন এবং পর্যায়ক্রমে সাইকেল প্যাডেলের মতো ঘোরান।",
        tip: "💡 ঘাড়ে টেনে জোর দেবেন না; কাঁধ মেঝে থেকে তুলে কোর দিয়ে শরীর ঘোরান।",
        durationOrReps: "১৬-২০ রেপস x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 ক্রাঞ্চ টুইস্ট: নিয়ন্ত্রিত রোটেশন, বিপরীত কনুই ও হাঁটু",
        formDescription: "Lie flat on back, rotating elbow to opposite knee smoothly",
      },
      {
        id: "i5",
        nameBn: "সিঙ্গেল-লেগ গ্লুট ব্রিজ",
        nameEn: "Single-Leg Glute Bridge",
        tag: "আইসোলেটেড পোস্টেরিয়র",
        tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        target: "🎯 একপেশে গ্লুট পাওয়ার, হ্যামস্ট্রিংস ও পেলভিক ব্যালান্স",
        instructions:
          "📋 চিত হয়ে শুয়ে এক হাঁটু ভাঁজ করে পা মাটিতে রাখুন এবং অন্য পা সোজা ওপরে রাখুন। মাটিতে থাকা পায়ের গোড়ালিতে ভর দিয়ে নিতম্ব উঁচুতে তুলুন।",
        tip: "💡 নিতম্ব সমান্তরালে রাখুন যাতে কোমর একপাশে হেলে না পড়ে; শীর্ষে গ্লুট স্কুইজ করুন।",
        durationOrReps: "৮-১০ রেপস প্রতি পায়ে x ৩ সেট",
        imageUrl:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80",
        formCue: "📐 সিঙ্গেল-লেগ ব্রিজ: এক পায়ে ভর দিয়ে নিতম্ব উঁচুতে তোলা",
        formDescription: "Single foot planted, opposite leg raised straight, hips elevated",
      },
    ],
  },
  advanced: {
    titleBn: "হার্ড (Advanced)",
    titleEn: "Advanced Bodyweight Calisthenics",
    badge: "🔴 লেভেল ৩",
    color: "#ef4444",
    duration: "২৫-৩০ মিনিট • সর্বোচ্চ শক্তি ও ক্যালরি বার্ন",
    exercises: [
      {
        id: "a1",
        nameBn: "ফুল চেস্ট-টু-ফ্লোর বারপিস",
        nameEn: "Chest-to-Floor Burpees with Jump",
        tag: "ফুল বডি এক্সপ্লোসিভ",
        tagColor: "bg-red-500/10 text-red-400 border-red-500/20",
        target: "🎯 সম্পূর্ণ শরীরের পেশী, দ্রুত ক্যালরি বার্ন ও কার্ডিওভাসকুলার সহনশীলতা",
        instructions:
          "📋 স্কোয়াট করে হাত মাটিতে রাখুন, পা পেছনে ছুড়ে বুক সম্পূর্ণ মেঝের স্পর্শ করান; দ্রুত পুশ করে পা ফিরিয়ে এনে ওপরে হাত তুলে উল্লম্ফন দিন।",
        tip: "💡 ল্যান্ডিংয়ের সময় হাঁটু কিছুটা ভাঁজ রাখুন এবং গতি ও শ্বাস-প্রশ্বাসের ছন্দ ধরে রাখুন।",
        durationOrReps: "১০-১৫ রেপস x ৩-৪ সেট",
        imageUrl: "",
        formCue: "📐 বার্পি সিকোয়েন্স: চেস্ট-টু-ফ্লোর ড্রপ ➔ এক্সপ্লোসিভ এয়ার জাম্প",
        formDescription:
          "2-step guide: পদক্ষেপ ১: চেস্ট-টু-ফ্লোর (বুক মেঝের স্পর্শ) to পদক্ষেপ ২: এক্সপ্লোসিভ জাম্প (মাথার ওপর হাত তুলে লাফ)",
        customGraphic: "chest-to-floor-burpees",
      },
      {
        id: "a2",
        nameBn: "ডায়মন্ড পুশ-আপ",
        nameEn: "Diamond Push-ups (Triangle Push-ups)",
        tag: "ট্রাইসেপস ও ইনার চেস্ট",
        tagColor: "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20",
        target: "🎯 ট্রাইসেপস, বুকের ভেতরের অংশ ও কাঁধের স্থিতিশীলতা",
        instructions:
          "📋 বুকের সোজা নিচে দুই হাতের বুড়ো আঙুল ও তর্জনী একসাথে মিলিয়ে ডায়মন্ড/ত্রিভুজ আকার তৈরি করুন। কনুই শরীরের পাশে রেখে বুক হাতের কাছে নামান ও পুশ করুন।",
        tip: "💡 কনুই বাইরের দিকে বেশি ছড়াবেন না, পেছনের দিকে ৪৫° কোণে রাখুন এবং কোর টানটান রাখুন।",
        durationOrReps: "৮-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 ডায়মন্ড গ্রিপ: তর্জনী-বুড়ো আঙুলে ত্রিভুজ, কনুই পেছনে লক",
        formDescription:
          "2-step guide: পদক্ষেপ ১: ত্রিভুজ গ্রিপ প্ল্যাঙ্ক to পদক্ষেপ ২: ডিপ চেস্ট ড্রপ",
        customGraphic: "diamond-pushup",
      },
      {
        id: "a3",
        nameBn: "প্লাইওমেট্রিক জাম্প স্কোয়াট",
        nameEn: "Plyometric Explosive Jump Squats",
        tag: "প্লায়োমেট্রিক্স ও পাওয়ার",
        tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        target: "🎯 এক্সপ্লোসিভ লেগ পাওয়ার, কোয়াডস, গ্লুটস ও দ্রুত গতি",
        instructions:
          "📋 গভীর স্কোয়াটে নেমে ঊরু মেঝের সমান্তরাল করুন, এরপর গোড়ালি ও পায়ের পাতায় পুরো শক্তি দিয়ে উল্লম্বভাবে ওপরে লাফ দিন এবং কোমলভাবে আবার স্কোয়াটে ল্যান্ড করুন।",
        tip: "💡 ল্যান্ড করার সাথে সাথে হাঁটু আলতো করে ৯০° ভাঁজ করে শক অ্যাবসর্ব করুন, পায়ের পুরো পাতায় স্থির থাকুন।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 জাম্প স্কোয়াট: ডিপ ৯০° স্কোয়াট ➔ সর্বোচ্চ উল্লম্ব উল্লম্ফন",
        formDescription:
          "2-step guide: পদক্ষেপ ১: ডিপ স্কোয়াট (৯০°) to পদক্ষেপ ২: এক্সপ্লোসিভ ভার্টিক্যাল জাম্প",
        customGraphic: "jump-squats",
      },
      {
        id: "a4",
        nameBn: "হলো বডি হোল্ড",
        nameEn: "Gymnastic Hollow Body Hold",
        tag: "অ্যাডভান্সড জিমন্যাস্টিক কোর",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 পেটের গভীর কোর পেশী, অ্যান্টি-এক্সটেনশন স্ট্রেংথ ও পিঠের সুরক্ষা",
        instructions:
          "📋 পিঠের ওপর শুয়ে কোমর মেঝের সাথে শক্তভাবে চেপে রাখুন। হাত কানের পাশ দিয়ে সোজা পেছনে এবং পা সোজা ওপরে তুলে শরীরকে একটি সুদৃঢ় কলার (ব্যানানা) আকারে ধরে রাখুন।",
        tip: "💡 লোয়ার ব্যাক যেন কোনোভাবেই মেঝে থেকে আলগা না হয়; পেট শক্ত করে শ্বাস স্বাভাবিক রাখুন।",
        durationOrReps: "২০-৩০ সেকেন্ড হোল্ড x ৩-৪ সেট",
        imageUrl: "",
        formCue: "📐 হলো শেপ: ফ্ল্যাট লোয়ার ব্যাক, হাত ও পা বাতাসে টানটান",
        formDescription:
          "2-step guide: পদক্ষেপ ১: পিঠ মাটিতে ফ্ল্যাট সেটআপ to পদক্ষেপ ২: হলো ব্যানার আর্ক হোল্ড",
        customGraphic: "hollow-body-hold",
      },
      {
        id: "a5",
        nameBn: "ডায়নামিক সাইড প্ল্যাঙ্ক উইথ হিপ ডিপস",
        nameEn: "Dynamic Side Plank with Hip Dips",
        tag: "ল্যাটারাল কোর ও ওবলিক",
        tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        target: "🎯 ওবলিকস, ল্যাটারাল কোর ও কাঁধের স্থিতিশীলতা",
        instructions:
          "📋 এক কনুই ও পায়ের পাতার পাশে ভর দিয়ে শরীর সোজা রেখায় সাইড প্ল্যাঙ্কে উঠুন। নিতম্ব ধীরে মেঝের দিকে নামিয়ে আবার শক্তিতে ওপরে উঁচু করে আর্চ তৈরি করুন।",
        tip: "💡 শরীর যেন সামনে বা পেছনে হেলে না যায়; ধড় একদম সোজা লম্বালম্বি সমতলে রাখুন।",
        durationOrReps: "১০-১২ রেপস প্রতি পাশে x ৩ সেট",
        imageUrl: "",
        formCue: "📐 সাইড প্ল্যাঙ্ক ডিপ: সোজা লাইন ➔ হিপ ডিপ ও এলিভেশন",
        formDescription:
          "2-step guide: পদক্ষেপ ১: হাই সাইড প্ল্যাঙ্ক to পদক্ষেপ ২: হিপ ডিপ ও ওবলিক কন্ট্রাকশন",
        customGraphic: "side-plank-hip-dips",
      },
    ],
  },
};

export type GymWorkoutLevel = "basic" | "intermediate" | "advanced";

export const GYM_EXERCISES_DATA: Record<
  GymWorkoutLevel,
  {
    titleBn: string;
    titleEn: string;
    badge: string;
    color: string;
    duration: string;
    exercises: Exercise[];
  }
> = {
  basic: {
    titleBn: "জিম বেসিক (ফাউন্ডেশন ও ফর্ম)",
    titleEn: "Gym Basic Foundation Routine",
    badge: "🏋️ লেভেল ১ (জিম)",
    color: "#38bdf8",
    duration: "২৫-৩০ মিনিট • ফুল বডি স্ট্রেন্থ",
    exercises: [
      {
        id: "g1",
        nameBn: "গবলেট স্কোয়াট",
        nameEn: "Goblet Squat (Dumbbell)",
        tag: "লেগস ও কোর",
        tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        target: "🎯 কোয়াড্রিসেপস, গ্লুটস ও কোর স্ট্যাবিলিটি",
        instructions:
          "📋 বুকের কাছে একটি ডাম্বেল দুই হাতে উল্লম্বভাবে শক্ত করে ধরুন। বুক সোজা ও পেট টাইট রেখে নিতম্ব পেছনের দিকে নামিয়ে ডিপ স্কোয়াট করুন। কনুই হাঁটুর ভেতরে রেখে হিল দিয়ে পুশ করে দাঁড়ান।",
        tip: "💡 পিঠ বাঁকাবেন না; কনুই ভেতরের দিকে রেখে বুক সর্বদা উঁচু রাখুন এবং সোজা দৃষ্টি রাখুন।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 গবলেট স্কোয়াট: বুকে ডাম্বেল লক ➔ ডিপ স্কোয়াট ও সোজা মেরুদণ্ড",
        formDescription:
          "2-step guide: পদক্ষেপ ১: বুকে ডাম্বেল উল্লম্ব to পদক্ষেপ ২: কনুই হাঁটুর ভেতরে রেখে ডিপ স্কোয়াট",
        customGraphic: "gym-goblet-squat",
      },
      {
        id: "g2",
        nameBn: "ডাম্বেল ফ্ল্যাট বেঞ্চ প্রেস",
        nameEn: "Dumbbell Flat Bench Press",
        tag: "চেস্ট ও ট্রাইসেপস",
        tagColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        target: "🎯 পেক্টোরালিস মেজর (বুকের পেশী), ট্রাইসেপস ও সামনের কাঁধ",
        instructions:
          "📋 ফ্ল্যাট বেঞ্চে শুয়ে পা দুটি মেঝেতে স্থির রাখুন। বুকের দুই পাশে ডাম্বেল ধরে কনুই ৪৫-৬০ ডিগ্রি কোণে রাখুন। শ্বাস ছেড়ে ডাম্বেল দুটি সোজা উপরের দিকে প্রেস করুন এবং নিয়ন্ত্রিত গতিতে নামিয়ে আনুন।",
        tip: "💡 কনুই কখনই কাঁধের সমান্তরাল ৯০° তে ছড়াবেন না, কাঁধের সুরক্ষায় কনুই সামান্য ভেতরের দিকে রাখুন।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 বেঞ্চ প্রেস: ৪৫° কনুইতে লোয়ারড ➔ ভার্টিকাল প্রেস ও চেস্ট স্কুইজ",
        formDescription:
          "2-step guide: পদক্ষেপ ১: বুকের পাশে ডাম্বেল to পদক্ষেপ ২: সোজা ওপরে ভার্টিকাল প্রেস",
        customGraphic: "gym-bench-press",
      },
      {
        id: "g3",
        nameBn: "ল্যাট পুলডাউন",
        nameEn: "Lat Pulldown Machine",
        tag: "ব্যাক ও বাইসেপস",
        tagColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        target: "🎯 ল্যাটিসিমাস ডরসি (পিঠের চওড়া পেশী), রম্বয়েডস ও বাইসেপস",
        instructions:
          "📋 মেশিনে বসে প্যাড দিয়ে ঊরু লক করুন। কাঁধের চেয়ে চওড়া গ্রিপে বার ধরুন। বুক সামান্য ফুলিয়ে পিঠের ল্যাটস সংকুচিত করে বারটি কলারবোন/বুকের উপরিভাগে টেনে আনুন ও ধীরে ধীরে ওপরে উঠতে দিন।",
        tip: "💡 শরীর অতিরিক্ত পেছনে দোলাবেন না; কনুই নিচের দিকে নামিয়ে পিঠের পেশি সর্বোচ্চ সংকুচিত করুন।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 ল্যাট পুলডাউন: ফুল স্ট্রেচ ➔ কলারবোনে বার ও ল্যাটস স্কুইজ",
        formDescription:
          "2-step guide: পদক্ষেপ ১: হাত সোজা প্রসারিত to পদক্ষেপ ২: কলারবোনে বার ও কনুই নিচে টান",
        customGraphic: "gym-lat-pulldown",
      },
      {
        id: "g4",
        nameBn: "ডাম্বেল রোমানিয়ান ডেডলিফট",
        nameEn: "Dumbbell Romanian Deadlift (RDL)",
        tag: "হ্যামস্ট্রিং ও গ্লুটস",
        tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        target: "🎯 হ্যামস্ট্রিংস, গ্লুটিয়াস ম্যাক্সিমাস ও লোয়ার ব্যাক",
        instructions:
          "📋 সোজা হয়ে দাঁড়িয়ে উরুর সামনে দুটি ডাম্বেল ধরুন, পা হিপ-উইডথ চওড়া। হাঁটু সামান্য সফট রেখে নিতম্ব পেছনের দিকে ঠেলে হিপ হিঞ্জ করুন। ডাম্বেল পায়ের কাছাকাছি রেখে শিন বোন পর্যন্ত নামান ও গ্লুটস চেপে দাঁড়ান।",
        tip: "💡 এটি স্কোয়াট নয়—হাঁটু অতিরিক্ত ভাঁজ করবেন না, কেবল নিতম্ব পেছনে ঠেলবেন ও মেরুদণ্ড ফ্ল্যাট রাখবেন।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 ডাম্বেল RDL: স্ট্যান্ডিং শুরু ➔ হিপ হিঞ্জ ও হ্যামস্ট্রিং লোড",
        formDescription:
          "2-step guide: পদক্ষেপ ১: সোজা মেরুদণ্ড ও কাঁধ লক to পদক্ষেপ ২: হিপ পেছনে ঠেলে শিন পর্যন্ত ডাম্বেল নামানো",
        customGraphic: "gym-rdl",
      },
      {
        id: "g5",
        nameBn: "সিটেড ডাম্বেল শোল্ডার প্রেস",
        nameEn: "Seated Dumbbell Shoulder Press",
        tag: "শোল্ডার ও ট্রাইসেপস",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 অ্যান্টিরিয়র ও ল্যাটেরাল ডেল্টয়েড (কাঁধ) এবং ট্রাইসেপস",
        instructions:
          "📋 খাড়া ব্যাকরেস্টের বেঞ্চে পিঠ সোজা রেখে বসুন। কানের উচ্চতায় দুই হাতে ডাম্বেল ধরুন, হাতের তালু সামনের দিকে ও কনুই সামান্য ভেতরে। শ্বাস ফেলে ডাম্বেল মাথার উপরে উল্লম্বভাবে প্রেস করুন ও মসৃণভাবে নামান।",
        tip: "💡 মাথার উপরে ডাম্বেল একে অপরের সাথে বাড়ি খাবেন না; পিঠ যেন আর্চ না হয়ে বেঞ্চে পুরোপুরি সাপোর্ট পায়।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 শোল্ডার প্রেস: কানের লেভেলে শুরু ➔ মাথার ওপর উল্লম্ব লক",
        formDescription:
          "2-step guide: পদক্ষেপ ১: কানের লেভেলে ডাম্বেল to পদক্ষেপ ২: মাথার ওপর উল্লম্ব প্রেস",
        customGraphic: "gym-shoulder-press",
      },
    ],
  },
  intermediate: {
    titleBn: "জিম মিডিয়াম (হাইপারট্রফি ও স্ট্রেংথ)",
    titleEn: "Gym Intermediate Strength & Hypertrophy",
    badge: "🏋️ লেভেল ২ (জিম)",
    color: "#f59e0b",
    duration: "৩৫-৪০ মিনিট • হেভি কম্পাউন্ড ও মেশিন",
    exercises: [
      {
        id: "gm1",
        nameBn: "বারবেল ব্যাক স্কোয়াট",
        nameEn: "Barbell Back Squat",
        tag: "লেগস ও পোস্টেরিয়র",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 কোয়াড্রিসেপস, গ্লুটস, হ্যামস্ট্রিংস ও স্পাইনাল ইরেক্টরস",
        instructions:
          "📋 অলিম্পিক বারবেল ট্র্যাপস পেশীর ওপর সেট করে স্কোয়াট র‍্যাক থেকে আন-র‍্যাক করুন। বুক চওড়া ও কোর ব্রেস করে নিতম্ব পেছনে নামিয়ে উরু মেঝের সমান্তরাল ৯০° করুন। হিলের শক্তিতে সোজা হয়ে উঠুন।",
        tip: "💡 হাঁটু যেন ভেতরের দিকে না ধসে যায়; বারবেল সোজা পায়ের পাতার মধ্যবর্তী লাইন ধরে নিচে নামবে।",
        durationOrReps: "৮-১০ রেপস x ৩-৪ সেট",
        imageUrl: "",
        formCue: "📐 ব্যাক স্কোয়াট: ট্র্যাপসে বারবেল ➔ ৯০° প্যারালাল স্কোয়াট",
        formDescription:
          "2-step guide: পদক্ষেপ ১: ট্র্যাপসে বারবেল লক to পদক্ষেপ ২: ৯০° সমান্তরাল ডেপথ ও ড্রাইভ আপ",
        customGraphic: "gym-barbell-squat",
      },
      {
        id: "gm2",
        nameBn: "বারবেল ফ্ল্যাট বেঞ্চ প্রেস",
        nameEn: "Barbell Flat Bench Press",
        tag: "চেস্ট কম্পাউন্ড",
        tagColor: "bg-red-500/10 text-red-400 border-red-500/20",
        target: "🎯 পেক্টোরালিস মেজর, সামনের ডেল্টয়েড ও ট্রাইসেপস",
        instructions:
          "📋 ফ্ল্যাট বেঞ্চে শুয়ে কাঁধের চেয়ে সামান্য চওড়া ওভারহ্যান্ড গ্রিপে বারবেল ধরুন। শ্বাস নিয়ে বারবেল নিয়ন্ত্রিত গতিতে বুকের মাঝামাঝি/নিচের অংশে আলতো স্পর্শ করান এবং শক্তিতে সোজা ওপরে প্রেস করুন।",
        tip: "💡 কব্জি বাঁকাবেন না, বারবেলের নিচে উল্লম্ব ফোরআর্ম বজায় রাখুন এবং কাঁধ পেছনের বেঞ্চে লক রাখুন।",
        durationOrReps: "৮-১০ রেপস x ৩-৪ সেট",
        imageUrl: "",
        formCue: "📐 বারবেল প্রেস: বুকে টাচ ➔ উল্লম্ব প্রেস ও ট্রাইসেপস লক",
        formDescription:
          "2-step guide: পদক্ষেপ ১: বারবেল বুকে নিয়ন্ত্রিত টাচ to পদক্ষেপ ২: ফুল আর্ম এক্সটেনশন প্রেস",
        customGraphic: "gym-barbell-bench-press",
      },
      {
        id: "gm3",
        nameBn: "বেন্ট-ওভার রো",
        nameEn: "Bent-Over Barbell Row",
        tag: "আপার ব্যাক ও ল্যাটস",
        tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        target: "🎯 মিডল ও লোয়ার ল্যাটস, রম্বয়েডস, রিয়ার ডেল্টয়েড ও লোয়ার ব্যাক",
        instructions:
          "📋 সোজা দাঁড়িয়ে কাঁধের সমান চওড়া গ্রিপে বারবেল ধরুন। হাঁটু সামান্য বাঁকিয়ে নিতম্ব পেছনে ঠেলে ধড়কে ৪৫° কোণে হিঞ্জ করুন। পিঠ সোজা রেখে বারবেল নাভির দিকে টেনে আনুন ও পিঠ স্কুইজ করুন।",
        tip: "💡 শরীরের ঝাঁকুনি দিয়ে বার টানবেন না; কনুই পেছন দিকে টেনে পিঠের পেশি সংকুচিত করুন।",
        durationOrReps: "৮-১০ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 বেন্ট-ওভার রো: ৪৫° হিপ হিঞ্জ ➔ নাভিতে বার ও ল্যাটস স্কুইজ",
        formDescription:
          "2-step guide: পদক্ষেপ ১: ৪৫° ফ্ল্যাট ব্যাক হিঞ্জ to পদক্ষেপ ২: নাভির দিকে বারবেল রো",
        customGraphic: "gym-bent-over-row",
      },
      {
        id: "gm4",
        nameBn: "ইনক্লাইন ডাম্বেল প্রেস",
        nameEn: "Incline Dumbbell Press",
        tag: "আপার চেস্ট",
        tagColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        target: "🎯 ক্ল্যাভিকুলার পেক্টোরালিস (উপরের বুক) ও অ্যান্টিরিয়র ডেল্টয়েড",
        instructions:
          "📋 ৩০-৪৫ ডিগ্রি ইনক্লাইন বেঞ্চে পিঠ লাগিয়ে বসুন। বুকের উপরের অংশের পাশে দুটি ডাম্বেল ধরে কনুই ৬০° কোণে রাখুন। শ্বাস ছেড়ে ডাম্বেল দুটি সোজা উপরের দিকে উল্লম্ব চাপে তুলুন ও মসৃণভাবে নামান।",
        tip: "💡 বেঞ্চ খুব বেশি খাড়া (৬০° এর বেশি) করবেন না, অন্যথায় বুকের বদলে কাঁধে বেশি চাপ পড়বে।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 ইনক্লাইন প্রেস: ৩০-৪৫° বেঞ্চ ➔ আপার চেস্ট ওভারহেড প্রেস",
        formDescription:
          "2-step guide: পদক্ষেপ ১: ৩০-৪৫° ইনক্লাইন লোয়ারড to পদক্ষেপ ২: আপার চেস্টে উল্লম্ব প্রেস",
        customGraphic: "gym-incline-dumbbell-press",
      },
      {
        id: "gm5",
        nameBn: "৪৫° লেগ প্রেস মেশিন",
        nameEn: "45° Sled Leg Press Machine",
        tag: "হেভি লেগস ও গ্লুটস",
        tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        target: "🎯 কোয়াড্রিসেপস, হ্যামস্ট্রিংস ও গ্লুটিয়াস ম্যাক্সিমাস",
        instructions:
          "📋 ৪৫° স্লেড সিটে পিঠ ও নিতম্ব শক্তভাবে সাঁটিয়ে বসুন। প্ল্যাটফর্মে পা কাঁধের সমান দূরত্বে রাখুন। সুরক্ষা লক খুলে হাঁটু ৯০° কোণে বুকের কাছে নামিয়ে আনুন এবং গোড়ালির চাপে স্লেড ওপরে পুশ করুন।",
        tip: "💡 শীর্ষে হাঁটু কখনই হাইপার-লক বা ঝাঁকুনি দিয়ে সোজা করবেন না; সর্বদা হালকা সফট বেন্ড রাখুন।",
        durationOrReps: "১০-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 লেগ প্রেস: ৯০° হাঁটু বেন্ড ➔ হিল পুশ ও সফট নি লক",
        formDescription:
          "2-step guide: পদক্ষেপ ১: প্ল্যাটফর্মে ৯০° হাঁটু ভাঁজ to পদক্ষেপ ২: হিল পুশ এক্সটেনশন",
        customGraphic: "gym-leg-press",
      },
    ],
  },
  advanced: {
    titleBn: "জিম হার্ড (হেভি কম্পাউন্ড ও পাওয়ার)",
    titleEn: "Gym Advanced Heavy Compound & Power",
    badge: "🏋️ লেভেল ৩ (জিম)",
    color: "#ef4444",
    duration: "৪০-৪৫ মিনিট • সর্বোচ্চ শক্তি ও স্ট্রেংথ",
    exercises: [
      {
        id: "gh1",
        nameBn: "কনভেনশনাল বারবেল ডেডলিফট",
        nameEn: "Conventional Barbell Deadlift",
        tag: "ফুল বডি পোস্টেরিয়র চেইন",
        tagColor: "bg-red-500/10 text-red-400 border-red-500/20",
        target: "🎯 গ্লুটস, হ্যামস্ট্রিংস, ইরেক্টর স্পাইনি, ল্যাটস ও ট্র্যাপস",
        instructions:
          "📋 মেঝেতে রাখা বারবেলের সামনে শিন ১ ইঞ্চি দূরে পা রাখুন। নিতম্ব পেছনে ঠেলে সোজা পিঠে বারবেল কাঁধের প্রস্থে শক্ত করে ধরুন। ল্যাটস লক ও বুক টান রেখে পা দিয়ে মেঝে পুশ করে নিতম্ব লকআউটে সোজা হয়ে দাঁড়ান।",
        tip: "💡 পিঠ কখনই রাউন্ড (গোল) করবেন না; বার সর্বদা পায়ের পাতার কাছে রেখে মেঝে ড্রাইভ করে তুলবেন।",
        durationOrReps: "৪-৬ রেপস x ৩-৪ সেট",
        imageUrl: "",
        formCue: "📐 ডেডলিফট: ফ্লোর সেটআপ ও টাইট ল্যাটস ➔ হিপ লকআউট",
        formDescription:
          "2-step guide: পদক্ষেপ ১: ফ্লোর থেকে ফ্ল্যাট স্পাইন সেটআপ to পদক্ষেপ ২: এক্সপ্লোসিভ হিপ লকআউট",
        customGraphic: "gym-barbell-deadlift",
      },
      {
        id: "gh2",
        nameBn: "স্ট্যান্ডিং বারবেল মিলিটারী প্রেস",
        nameEn: "Standing Barbell Overhead Military Press",
        tag: "শোল্ডার ও কোর স্ট্যাবিলিটি",
        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        target: "🎯 অ্যান্টিরিয়র ডেল্টয়েড, ট্রাইসেপস, ট্র্যাপস ও সম্পূর্ণ কোর",
        instructions:
          "📋 সোজা দাঁড়িয়ে কলারবোনের ওপর বারবেল রেস্ট করুন, কনুই সামান্য সামনের দিকে। গ্লুটস ও পেট শক্ত করে ব্রেস রেখে বারবেল উল্লম্বভাবে মাথার উপরে সোজা প্রেস করে লকআউট করুন ও কলারবোনে নিয়ন্ত্রণ সহ নামান।",
        tip: "💡 কোমর অতিরিক্ত পেছন দিকে আর্চ করবেন না; কোর ও গ্লুটস পাথরের মতো শক্ত করে সোজা লাইন ধরে প্রেস করুন।",
        durationOrReps: "৬-৮ রেপস x ৩-৪ সেট",
        imageUrl: "",
        formCue: "📐 মিলিটারী প্রেস: কলারবোন রেস্ট ➔ ওভারহেড উল্লম্ব লকআউট",
        formDescription:
          "2-step guide: পদক্ষেপ ১: কলারবোনে বারবেল ও টাইট কোর to পদক্ষেপ ২: মাথার ওপর উল্লম্ব লকআউট",
        customGraphic: "gym-overhead-press",
      },
      {
        id: "gh3",
        nameBn: "বুলগেরিয়ান স্প্লিট স্কোয়াট",
        nameEn: "Bulgarian Split Squat (Dumbbell)",
        tag: "ইউনিলেটারাল লেগস",
        tagColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        target: "🎯 কোয়াড্রিসেপস, গ্লুট মিডিয়াস, হ্যামস্ট্রিংস ও ব্যালেন্স",
        instructions:
          "📋 ফ্ল্যাট বেঞ্চের সামনে দাঁড়িয়ে পেছনের পায়ের পাতা বেঞ্চের ওপর রাখুন। দুই হাতে ডাম্বেল নিয়ে সামনের হাঁটু ৯০° কোণে নামিয়ে ডিপ সিঙ্গেল-লেগ স্কোয়াট করুন। সামনের হিলে চাপ দিয়ে ওপরে উঠুন।",
        tip: "💡 সামনের হাঁটু যেন পায়ের বুড়ো আঙুল ছাড়িয়ে খুব বেশি এগিয়ে না যায়; পেছনের হাঁটু মেঝের কাছাকাছি নামান।",
        durationOrReps: "৮-১০ রেপস প্রতি পায়ে x ৩ সেট",
        imageUrl: "",
        formCue: "📐 স্প্লিট স্কোয়াট: রিয়ার ফুট অন বেঞ্চ ➔ ৯০° ডিপ সিঙ্গেল লেগ",
        formDescription:
          "2-step guide: পদক্ষেপ ১: বেঞ্চে পেছনের পা স্থাপন to পদক্ষেপ ২: ৯০° ডিপ সিঙ্গেল লেগ স্কোয়াট",
        customGraphic: "gym-bulgarian-split-squat",
      },
      {
        id: "gh4",
        nameBn: "প্যারালাল বার ডিপস",
        nameEn: "Parallel Bar Dips (Bodyweight / Weighted)",
        tag: "লোয়ার চেস্ট ও ট্রাইসেপস",
        tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        target: "🎯 পেক্টোরালিস মেজর (নিচের বুক), ট্রাইসেপস ও সামনের কাঁধ",
        instructions:
          "📋 প্যারালাল বারে হাত রেখে শরীর শূন্যে ঝুলিয়ে তুলুন। ধড় সামান্য সামনে ঝুঁকিয়ে কনুই ৯০° কোণে ভাঁজ করে শরীর নিচে নামান। বুকের নিচের অংশে টান অনুভব হলে বুক ও ট্রাইসেপসের শক্তিতে পুশ করে ওপরে উঠুন।",
        tip: "💡 কাঁধের ইনজুরি এড়াতে ৯০ ডিগ্রির বেশি অতিরিক্ত নিচে নামবেন না এবং শরীর সামনে সামান্য হেলিয়ে রাখবেন।",
        durationOrReps: "৮-১২ রেপস x ৩ সেট",
        imageUrl: "",
        formCue: "📐 বার ডিপস: ফুল আর্ম লক ➔ ৯০° কনুই ফ্লেক্স ও চেস্ট ডিপ",
        formDescription:
          "2-step guide: পদক্ষেপ ১: শূন্যে আর্ম লক সাপোর্ট to পদক্ষেপ ২: ৯০° কনুইতে ডিপ ডিসেন্ট",
        customGraphic: "gym-parallel-dips",
      },
      {
        id: "gh5",
        nameBn: "বারবেল হিপ থ্রাস্ট",
        nameEn: "Barbell Hip Thrust (Bench Supported)",
        tag: "ম্যাক্সিমাল গ্লুটস ও হিপ্স",
        tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        target: "🎯 গ্লুটিয়াস ম্যাক্সিমাস, হ্যামস্ট্রিংস ও পেলভিক স্ট্যাবিলিটি",
        instructions:
          "📋 ফ্ল্যাট বেঞ্চের কিনারায় আপার ব্যাক সাপোর্ট দিয়ে মেঝেতে বসুন। হিপ ক্রিজের ওপর প্যাডেড বারবেল রাখুন। হিল দিয়ে মেঝেকে পুশ করে নিতম্ব শক্তিতে ওপরে তুলে হাঁটু ৯০° কোণে টেবিলটপ অবস্থানে আনুন ও গ্লুটস চরম সংকুচিত করুন।",
        tip: "💡 শীর্ষে ঘাড় পেছনে ফেলবেন না, চিবুক বুকের কাছে রাখুন এবং কোমর অতিরিক্ত আর্চ না করে কেবল গ্লুটস স্কুইজ করুন।",
        durationOrReps: "৮-১০ রেপস x ৩-৪ সেট",
        imageUrl: "",
        formCue: "📐 হিপ থ্রাস্ট: ফ্লোর স্টার্ট ➔ ৯০° হাঁটু ও গ্লুট পিক স্কুইজ",
        formDescription:
          "2-step guide: পদক্ষেপ ১: বেঞ্চ ব্যাক সাপোর্ট ও বারবেল ইন হিপ to পদক্ষেপ ২: হিপ ফুল এক্সটেনশন ও স্কুইজ",
        customGraphic: "gym-hip-thrust",
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

function PushUpTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="puBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradAmber" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#b45309" stopOpacity="0.45" />
          <stop offset="1" stopColor="#d97706" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="puTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="puTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#puBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (HIGH PLANK START) ================= */}
      {/* Step Badge */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#38bdf8" />
      <text x="48" y="33" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: হাই প্ল্যাঙ্ক
      </text>

      {/* Floor Yoga Mat */}
      <rect x="35" y="244" width="230" height="15" rx="5" fill="url(#matGradAmber)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />

      {/* Alignment Guideline (Head to Heel Straight Line) */}
      <line x1="75" y1="130" x2="245" y2="235" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <rect x="135" y="148" width="65" height="18" rx="4" fill="#000" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="0.8" />
      <text x="167" y="161" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">
        সোজা রেখা
      </text>

      {/* Human Figure: Top of Push-up (High Plank on Hands and Toes) */}
      <g transform="translate(20, 10)">
        {/* Head */}
        <circle cx="65" cy="122" r="12" fill="#cbd5e1" />
        {/* Neck */}
        <line x1="74" y1="128" x2="84" y2="135" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        {/* Torso & Hips */}
        <path d="M82 135 L145 170 L138 186 L76 150 Z" fill="url(#puTorso1)" />
        {/* Arms: Extended straight down to mat */}
        <line x1="88" y1="145" x2="88" y2="234" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
        {/* Hand on floor */}
        <ellipse cx="88" cy="235" rx="8" ry="3.5" fill="#0284c7" />
        {/* Legs: Straight back to toes */}
        <line x1="140" y1="178" x2="225" y2="230" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        {/* Toes planted on mat */}
        <ellipse cx="227" cy="232" rx="7" ry="4" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        হাতে ও পায়ের আঙুলে ভর, শরীর তক্তার মতো সোজা
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (CHEST LOWERED / 90° ELBOWS) ================= */}
      {/* Step Badge */}
      <rect x="325" y="16" width="150" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: লোয়ার পুশ
      </text>

      {/* Floor Yoga Mat */}
      <rect x="335" y="244" width="230" height="15" rx="5" fill="url(#matGradAmber)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />

      {/* 90° Elbow Guideline Indicator */}
      <path d="M380 188 L380 162 L405 162" stroke="#ccff00" strokeWidth="1.5" fill="none" opacity="0.9" />
      <rect x="345" y="145" width="55" height="18" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="372" y="158" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৯০° কনুই
      </text>

      {/* Downward Chest Movement Indicator Arrow */}
      <path d="M420 165 L420 195" stroke="#ccff00" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.8" />
      <polygon points="416,193 424,193 420,200" fill="#ccff00" opacity="0.9" />

      {/* Human Figure: Bottom of Push-up (Chest near mat, 90° bent elbows) */}
      <g transform="translate(320, 25)">
        {/* Head */}
        <circle cx="65" cy="180" r="12" fill="#f8fafc" />
        {/* Neck */}
        <line x1="74" y1="184" x2="84" y2="188" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        {/* Torso & Hips: Lowered horizontal near floor */}
        <path d="M84 188 L155 196 L152 210 L82 202 Z" fill="url(#puTorso2)" />
        {/* Arms: Bent at 90° (Shoulder to Elbow pointing back-up, then down to hand) */}
        <polyline points="88,193 68,172 88,219" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        {/* Hand on floor */}
        <ellipse cx="88" cy="220" rx="8" ry="3.5" fill="#65a30d" />
        {/* Legs: Flat straight line from hips to toes */}
        <line x1="152" y1="203" x2="225" y2="217" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        {/* Toes planted on mat */}
        <ellipse cx="227" cy="218" rx="7" ry="4" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        বুক মেঝের ১ ইঞ্চি ওপরে, কনুই ৯০° কোণে পেছনের দিকে
      </text>
    </svg>
  );
}

function ReverseLungeTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="rlBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradBlue" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#1e3a8a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="rlTorso1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="rlTorso2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#rlBg)" />

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

      {/* Human Figure: Standing upright, hands on hips */}
      <g transform="translate(150, 72)">
        {/* Head */}
        <circle cx="0" cy="16" r="13" fill="#cbd5e1" />
        {/* Neck */}
        <line x1="0" y1="29" x2="0" y2="38" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        {/* Torso upright */}
        <path d="M-15 42 Q0 38 15 42 L12 102 Q0 105 -12 102 Z" fill="url(#rlTorso1)" />
        {/* Arms: Hands on hips */}
        <path d="M-15 45 L-25 78 L-12 88" stroke="#cbd5e1" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M15 45 L25 78 L12 88" stroke="#cbd5e1" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Shorts */}
        <path d="M-13 102 L13 102 L15 122 L-15 122 Z" fill="#0f172a" />
        {/* Legs: Hip-width neutral stance */}
        <line x1="-8" y1="122" x2="-8" y2="182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <line x1="8" y1="122" x2="8" y2="182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        {/* Feet: Flat on ground */}
        <ellipse cx="-8" cy="183" rx="9" ry="4" fill="#0284c7" />
        <ellipse cx="8" cy="183" rx="9" ry="4" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        সোজা হয়ে দাঁড়ান, পা স্বাভাবিক ও হাত কোমরে
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (REVERSE LUNGE) ================= */}
      {/* Step Badge */}
      <rect x="325" y="16" width="160" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: রিভার্স লাঞ্জ
      </text>

      {/* Floor Mat Marker */}
      <ellipse cx="460" cy="256" rx="105" ry="12" fill="url(#matGradBlue)" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />

      {/* 90° Front Knee Indicator */}
      <path d="M405 160 L405 140 L425 140" stroke="#ccff00" strokeWidth="1.5" fill="none" opacity="0.9" />
      <rect x="375" y="125" width="45" height="18" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="397" y="138" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৯০°
      </text>

      {/* 90° Back Knee Indicator */}
      <rect x="480" y="175" width="75" height="18" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="517" y="188" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        উভয় হাঁটু ৯০°
      </text>

      {/* Step-Back Motion Indicator Arrow */}
      <path d="M440 220 C460 210 490 215 515 235" stroke="#ccff00" strokeWidth="1.8" strokeDasharray="3 3" fill="none" opacity="0.8" />
      <polygon points="513,230 520,237 510,238" fill="#ccff00" opacity="0.9" />

      {/* Human Figure: Deep 90-degree Reverse Lunge */}
      <g transform="translate(450, 75)">
        {/* Head */}
        <circle cx="10" cy="15" r="13" fill="#f8fafc" />
        {/* Neck */}
        <line x1="10" y1="28" x2="10" y2="38" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        {/* Torso: Perfectly Upright */}
        <path d="M-3 42 Q10 38 23 42 L20 102 Q10 105 0 102 Z" fill="url(#rlTorso2)" />
        {/* Hands on Hips */}
        <path d="M-3 45 L-15 75 L0 85" stroke="#f8fafc" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M23 45 L35 75 L20 85" stroke="#f8fafc" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Shorts */}
        <path d="M-1 102 L21 102 L23 120 L-3 120 Z" fill="#0f172a" />

        {/* Front Leg: Thigh horizontal at 90°, shin vertical downwards */}
        {/* Front Thigh (hip to knee forward) */}
        <line x1="10" y1="115" x2="-45" y2="115" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
        {/* Front Shin (knee down to foot) */}
        <line x1="-45" y1="115" x2="-45" y2="175" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        {/* Front Foot flat on ground */}
        <ellipse cx="-45" cy="177" rx="10" ry="4" fill="#65a30d" />

        {/* Back Leg: Stepped backward, thigh down vertical, back knee hovering off floor */}
        {/* Back Thigh (hip down to hovering knee) */}
        <line x1="12" y1="115" x2="25" y2="165" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
        {/* Back Shin (hovering knee back to toes) */}
        <line x1="25" y1="165" x2="75" y2="173" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        {/* Back Toes on floor */}
        <ellipse cx="76" cy="175" rx="7" ry="4" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        এক পা পেছনে নিন, উভয় হাঁটু ৯০° কোণে ও ধড় সোজা
      </text>
    </svg>
  );
}

function ChestToFloorBurpeesTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="burpBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradRed" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#991b1b" stopOpacity="0.45" />
          <stop offset="1" stopColor="#dc2626" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="burpTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="burpTorso2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#burpBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (CHEST-TO-FLOOR) ================= */}
      <rect x="25" y="16" width="165" height="26" rx="13" fill="#991b1b" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#f87171" />
      <text x="48" y="33" fill="#fca5a5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: চেস্ট-টু-ফ্লোর
      </text>

      {/* Yoga Mat */}
      <rect x="35" y="244" width="230" height="15" rx="5" fill="url(#matGradRed)" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.5" />

      {/* Chest Contact Indicator */}
      <line x1="60" y1="236" x2="160" y2="236" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
      <rect x="75" y="152" width="105" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#ef4444" strokeWidth="0.8" />
      <text x="127" y="166" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700" fontFamily="monospace">
        বুক মেঝের স্পর্শ
      </text>
      <path d="M127 174 L127 215" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
      <polygon points="124,213 130,213 127,220" fill="#ef4444" />

      {/* Figure lying flat on mat */}
      <g transform="translate(25, 45)">
        <circle cx="60" cy="184" r="12" fill="#cbd5e1" />
        <line x1="68" y1="187" x2="78" y2="190" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <path d="M78 190 L155 194 L152 205 L76 200 Z" fill="url(#burpTorso1)" />
        <polyline points="85,193 62,178 82,203" stroke="#cbd5e1" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="82" cy="204" rx="7" ry="3" fill="#0284c7" />
        <line x1="152" y1="198" x2="228" y2="201" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="230" cy="202" rx="6" ry="3.5" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        পা পেছনে ছুড়ে বুক সম্পূর্ণ মেঝের ওপর নামান
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (EXPLOSIVE JUMP) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: এক্সপ্লোসিভ জাম্প
      </text>

      {/* Mat on floor */}
      <ellipse cx="450" cy="256" rx="85" ry="12" fill="url(#matGradRed)" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.5" />

      {/* Airborne Air Gap & Motion Lines */}
      <path d="M430 240 L430 205" stroke="#ccff00" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.8" />
      <path d="M470 240 L470 205" stroke="#ccff00" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.8" />
      <polygon points="427,207 433,207 430,200" fill="#ccff00" />
      <polygon points="467,207 473,207 470,200" fill="#ccff00" />

      <rect x="385" y="55" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="450" y="69" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        বাতাসে উল্লম্ফন ও হাত ওপরে
      </text>

      {/* Human Figure in Mid-Air Star Extension */}
      <g transform="translate(450, 42)">
        <circle cx="0" cy="38" r="13" fill="#f8fafc" />
        <line x1="0" y1="51" x2="0" y2="58" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <path d="M-14 62 Q0 58 14 62 L12 118 Q0 120 -12 118 Z" fill="url(#burpTorso2)" />
        <line x1="-12" y1="65" x2="-26" y2="10" stroke="#f8fafc" strokeWidth="6.5" strokeLinecap="round" />
        <line x1="12" y1="65" x2="26" y2="10" stroke="#f8fafc" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M-11 118 L11 118 L13 136 L-13 136 Z" fill="#0f172a" />
        <line x1="-7" y1="136" x2="-10" y2="188" stroke="#f8fafc" strokeWidth="7.5" strokeLinecap="round" />
        <line x1="7" y1="136" x2="10" y2="188" stroke="#f8fafc" strokeWidth="7.5" strokeLinecap="round" />
        <ellipse cx="-11" cy="190" rx="4" ry="7" fill="#65a30d" />
        <ellipse cx="11" cy="190" rx="4" ry="7" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        শক্তিশালী চাপে লাফিয়ে দুই হাত মাথার ওপরে তুলুন
      </text>
    </svg>
  );
}

function DiamondPushUpTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="diaBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradLime" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#365314" stopOpacity="0.45" />
          <stop offset="1" stopColor="#4d7c0f" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="diaTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="diaTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#diaBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (DIAMOND SETUP) ================= */}
      <rect x="25" y="16" width="165" height="26" rx="13" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#38bdf8" />
      <text x="48" y="33" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: ডায়মন্ড সেটআপ
      </text>

      {/* Mat */}
      <rect x="35" y="244" width="230" height="15" rx="5" fill="url(#matGradLime)" stroke="#84cc16" strokeWidth="1" strokeOpacity="0.5" />

      {/* Diamond Hand Grip Badge */}
      <g transform="translate(95, 128)">
        <rect x="0" y="0" width="85" height="26" rx="5" fill="#000" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="0.8" />
        <polygon points="12,13 18,7 24,13 18,19" fill="#38bdf8" />
        <text x="30" y="17" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="sans-serif">
          ত্রিভুজ গ্রিপ
        </text>
      </g>

      {/* Figure: Plank with hands inward */}
      <g transform="translate(20, 10)">
        <circle cx="65" cy="122" r="12" fill="#cbd5e1" />
        <line x1="74" y1="128" x2="84" y2="135" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <path d="M82 135 L145 170 L138 186 L76 150 Z" fill="url(#diaTorso1)" />
        <line x1="88" y1="145" x2="98" y2="234" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
        <polygon points="98,228 104,235 98,240 92,235" fill="#0284c7" />
        <line x1="140" y1="178" x2="225" y2="230" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="227" cy="232" rx="7" ry="4" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        বুড়ো আঙুল ও তর্জনী মিলিয়ে বুকের নিচে ত্রিভুজ বানান
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (DEEP DIAMOND PUSH) ================= */}
      <rect x="325" y="16" width="150" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: ডিপ পুশ
      </text>

      {/* Mat */}
      <rect x="335" y="244" width="230" height="15" rx="5" fill="url(#matGradLime)" stroke="#84cc16" strokeWidth="1" strokeOpacity="0.5" />

      {/* Elbows Tucked Back Indicator */}
      <rect x="340" y="132" width="125" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="402" y="146" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        কনুই বডির কাছে (৪৫°)
      </text>

      {/* Lowered Figure */}
      <g transform="translate(320, 25)">
        <circle cx="65" cy="180" r="12" fill="#f8fafc" />
        <line x1="74" y1="184" x2="84" y2="188" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <path d="M84 188 L155 196 L152 210 L82 202 Z" fill="url(#diaTorso2)" />
        <polyline points="88,193 68,175 96,220" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="96,215 101,221 96,226 91,221" fill="#65a30d" />
        <line x1="152" y1="203" x2="225" y2="217" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="227" cy="218" rx="7" ry="4" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        কনুই শরীরের পাশে রেখে বুক হাতের ওপর নামান ও পুশ করুন
      </text>
    </svg>
  );
}

function JumpSquatTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="jsBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradBlueJS" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#1e3a8a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="jsTorso1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="jsTorso2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#jsBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (DEEP SQUAT LOAD) ================= */}
      <rect x="25" y="16" width="160" height="26" rx="13" fill="#1e3a8a" fillOpacity="0.35" stroke="#3b82f6" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#60a5fa" />
      <text x="48" y="33" fill="#93c5fd" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: ডিপ স্কোয়াট
      </text>

      {/* Mat */}
      <ellipse cx="150" cy="256" rx="85" ry="12" fill="url(#matGradBlueJS)" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />

      {/* 90° Guideline */}
      <line x1="85" y1="205" x2="180" y2="205" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.85" />
      <rect x="90" y="212" width="75" height="18" rx="4" fill="#000" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="0.8" />
      <text x="127" y="225" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৯০° স্প্রিং লোড
      </text>

      {/* Human Figure: Deep Squat ready to explode */}
      <g transform="translate(135, 110)">
        <circle cx="0" cy="15" r="13" fill="#cbd5e1" />
        <line x1="0" y1="28" x2="3" y2="36" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <path d="M-8 40 L16 38 L25 90 L-4 92 Z" fill="url(#jsTorso1)" />
        <line x1="12" y1="48" x2="-40" y2="58" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
        <path d="M-5 92 L25 90 L38 108 L10 112 Z" fill="#0f172a" />
        <line x1="28" y1="98" x2="-18" y2="98" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
        <line x1="-18" y1="98" x2="-12" y2="150" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-18" cy="151" rx="12" ry="4.5" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        নিতম্ব পেছনে নামিয়ে স্প্রিংয়ের মতো শক্তি জমা করুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (EXPLOSIVE VERTICAL JUMP) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: এক্সপ্লোসিভ জাম্প
      </text>

      {/* Floor Mat */}
      <ellipse cx="450" cy="256" rx="85" ry="12" fill="url(#matGradBlueJS)" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />

      {/* Jump Trajectory Arrows */}
      <path d="M430 240 L430 200" stroke="#ccff00" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
      <path d="M470 240 L470 200" stroke="#ccff00" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
      <polygon points="426,202 434,202 430,195" fill="#ccff00" />
      <polygon points="466,202 474,202 470,195" fill="#ccff00" />

      <rect x="385" y="55" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="450" y="69" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        বাতাসে সর্বোচ্চ উল্লম্ফন
      </text>

      {/* Human Figure: Full Extended Vertical Airborne Jump */}
      <g transform="translate(450, 48)">
        <circle cx="0" cy="35" r="13" fill="#f8fafc" />
        <line x1="0" y1="48" x2="0" y2="56" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <path d="M-14 60 Q0 56 14 60 L12 116 Q0 118 -12 116 Z" fill="url(#jsTorso2)" />
        <line x1="-12" y1="65" x2="-25" y2="110" stroke="#f8fafc" strokeWidth="6.5" strokeLinecap="round" />
        <line x1="12" y1="65" x2="25" y2="110" stroke="#f8fafc" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M-11 116 L11 116 L13 134 L-13 134 Z" fill="#0f172a" />
        <line x1="-7" y1="134" x2="-8" y2="182" stroke="#f8fafc" strokeWidth="7.5" strokeLinecap="round" />
        <line x1="7" y1="134" x2="8" y2="182" stroke="#f8fafc" strokeWidth="7.5" strokeLinecap="round" />
        <ellipse cx="-8" cy="184" rx="4" ry="7" fill="#65a30d" />
        <ellipse cx="8" cy="184" rx="4" ry="7" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        পায়ের পুরো শক্তিতে ওপরে লাফ দিন ও আলতো ল্যান্ড করুন
      </text>
    </svg>
  );
}

function HollowBodyHoldTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="hbBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradAmberHB" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#b45309" stopOpacity="0.45" />
          <stop offset="1" stopColor="#d97706" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="hbTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="hbTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#hbBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (FLAT BACK SETUP) ================= */}
      <rect x="25" y="16" width="165" height="26" rx="13" fill="#b45309" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#fbbf24" />
      <text x="48" y="33" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: ফ্ল্যাট ব্যাক সেটআপ
      </text>

      {/* Mat */}
      <rect x="35" y="244" width="230" height="15" rx="5" fill="url(#matGradAmberHB)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />

      {/* Flat Back Contact Indicator */}
      <rect x="70" y="145" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="0.8" />
      <text x="142" y="159" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">
        লোয়ার ব্যাক মেঝের সাথে লক
      </text>

      {/* Figure lying flat with knees tucked */}
      <g transform="translate(30, 40)">
        <circle cx="55" cy="190" r="12" fill="#cbd5e1" />
        <line x1="65" y1="192" x2="78" y2="194" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <path d="M78 194 L150 196 L148 206 L76 204 Z" fill="url(#hbTorso1)" />
        <polyline points="148,198 175,160 195,195" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="196" cy="197" rx="7" ry="4" fill="#0284c7" />
        <line x1="85" y1="194" x2="135" y2="175" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        লোয়ার ব্যাক মেঝের সাথে চেপে ফাঁকা বন্ধ করুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (HOLLOW BANANA HOLD) ================= */}
      <rect x="325" y="16" width="160" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: হলো ব্যানানা হোল্ড
      </text>

      {/* Mat */}
      <rect x="335" y="244" width="230" height="15" rx="5" fill="url(#matGradAmberHB)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />

      {/* Hollow Banana Arc Indicator */}
      <path d="M365 170 Q450 248 545 185" stroke="#ccff00" strokeWidth="1.8" strokeDasharray="3 3" fill="none" opacity="0.8" />
      <rect x="385" y="115" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="450" y="129" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        ব্যানানা আর্ক কার্ভ (নো গ্যাপ)
      </text>

      {/* Figure in True Gymnastic Hollow Body Arc */}
      <g transform="translate(330, 20)">
        <circle cx="65" cy="172" r="12" fill="#f8fafc" />
        <line x1="75" y1="180" x2="35" y2="162" stroke="#f8fafc" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M75 182 Q115 218 145 220 L142 228 Q110 225 70 190 Z" fill="url(#hbTorso2)" />
        <line x1="142" y1="222" x2="215" y2="178" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="218" cy="176" rx="7" ry="4" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        হাত ও পা সোজা বাতাসে রেখে হলো শেপ ধরে রাখুন
      </text>
    </svg>
  );
}

function SidePlankHipDipsTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="spBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradPurple" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#581c87" stopOpacity="0.45" />
          <stop offset="1" stopColor="#7e22ce" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="spTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="spTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#spBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (HIGH SIDE PLANK) ================= */}
      <rect x="25" y="16" width="165" height="26" rx="13" fill="#581c87" fillOpacity="0.3" stroke="#a855f7" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#c084fc" />
      <text x="48" y="33" fill="#e9d5ff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: হাই সাইড প্ল্যাঙ্ক
      </text>

      {/* Mat */}
      <rect x="35" y="244" width="230" height="15" rx="5" fill="url(#matGradPurple)" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.5" />

      {/* Straight Diagonal Line Indicator */}
      <line x1="75" y1="130" x2="235" y2="240" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />
      <rect x="110" y="115" width="115" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="0.8" />
      <text x="167" y="129" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">
        সোজা ডায়াগনাল রেখা
      </text>

      {/* Figure in Side Plank */}
      <g transform="translate(25, 20)">
        <circle cx="65" cy="120" r="12" fill="#cbd5e1" />
        <line x1="74" y1="126" x2="86" y2="135" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <path d="M84 135 L145 175 L138 188 L78 148 Z" fill="url(#spTorso1)" />
        <polyline points="88,145 92,218 125,218" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M86 138 L95 160 L120 162" stroke="#cbd5e1" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="140" y1="180" x2="215" y2="220" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="217" cy="221" rx="7" ry="4" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        কনুই ও পায়ের পাশে ভর দিয়ে শরীর সোজা রেখায় তুলুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (HIP DIP & ELEVATION) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: হিপ ডিপ ও লিফট
      </text>

      {/* Mat */}
      <rect x="335" y="244" width="230" height="15" rx="5" fill="url(#matGradPurple)" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.5" />

      {/* Dynamic Hip Dip Arrow Indicator */}
      <path d="M465 170 Q485 195 465 220" stroke="#ccff00" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.9" />
      <polygon points="461,172 468,168 469,176" fill="#ccff00" />
      <polygon points="461,218 468,222 469,214" fill="#ccff00" />

      <rect x="380" y="105" width="140" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="450" y="119" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        হিপ ডিপ ➔ ওবলিক কন্ট্রাকশন
      </text>

      {/* Figure in Dynamic Dip & High Arch */}
      <g transform="translate(325, 20)">
        <circle cx="65" cy="120" r="12" fill="#f8fafc" />
        <line x1="74" y1="126" x2="86" y2="135" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <path d="M84 135 L145 165 L138 180 L78 148 Z" fill="url(#spTorso2)" />
        <polyline points="88,145 92,218 125,218" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="86" y1="138" x2="86" y2="92" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <line x1="140" y1="172" x2="215" y2="220" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="217" cy="221" rx="7" ry="4" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        নিতম্ব নিচে নামিয়ে আবার সর্বোচ্চ উঁচুতে আর্চ করুন
      </text>
    </svg>
  );
}

function KneePushUpTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="kpBg" x1="0" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="matGradLimeKP" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#365314" stopOpacity="0.45" />
          <stop offset="1" stopColor="#4d7c0f" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="kpTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="kpTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ccff00" />
          <stop offset="1" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#kpBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (KNEE PLANK START) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#38bdf8" />
      <text x="48" y="33" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Mat */}
      <rect x="35" y="244" width="230" height="15" rx="5" fill="url(#matGradLimeKP)" stroke="#84cc16" strokeWidth="1" strokeOpacity="0.5" />

      {/* Head-to-Knee Straight Line Indicator */}
      <line x1="75" y1="130" x2="195" y2="235" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <rect x="100" y="145" width="125" height="18" rx="4" fill="#000" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="0.8" />
      <text x="162" y="158" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">
        মাথা থেকে হাঁটু সোজা
      </text>

      {/* Figure in Knee Plank Position */}
      <g transform="translate(20, 15)">
        <circle cx="65" cy="122" r="12" fill="#cbd5e1" />
        <line x1="74" y1="128" x2="84" y2="135" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <path d="M82 135 L145 170 L138 186 L76 150 Z" fill="url(#kpTorso1)" />
        <line x1="88" y1="145" x2="88" y2="229" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="88" cy="230" rx="8" ry="3.5" fill="#0284c7" />
        <line x1="140" y1="178" x2="185" y2="225" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="187" cy="227" rx="9" ry="5" fill="#0284c7" />
        <line x1="187" y1="227" x2="220" y2="205" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="221" cy="204" rx="5" ry="3.5" fill="#0284c7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        হাঁটু মাটিতে রেখে শরীর মাথা থেকে হাঁটু সোজা রাখুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (PUSH-UP 90°) ================= */}
      <rect x="325" y="16" width="150" height="26" rx="13" fill="#84cc16" fillOpacity="0.2" stroke="#ccff00" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#ccff00" />
      <text x="348" y="33" fill="#ccff00" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: পুশ-আপ
      </text>

      {/* Mat */}
      <rect x="335" y="244" width="230" height="15" rx="5" fill="url(#matGradLimeKP)" stroke="#84cc16" strokeWidth="1" strokeOpacity="0.5" />

      {/* 90° Elbow Indicator */}
      <path d="M380 188 L380 162 L405 162" stroke="#ccff00" strokeWidth="1.5" fill="none" opacity="0.9" />
      <rect x="345" y="145" width="55" height="18" rx="4" fill="#000" fillOpacity="0.85" stroke="#ccff00" strokeWidth="0.8" />
      <text x="372" y="158" textAnchor="middle" fill="#ccff00" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৯০° কনুই
      </text>

      {/* Downward Chest Movement Arrow */}
      <path d="M420 165 L420 195" stroke="#ccff00" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.8" />
      <polygon points="416,193 424,193 420,200" fill="#ccff00" opacity="0.9" />

      {/* Figure Lowered with Knees on Mat */}
      <g transform="translate(320, 30)">
        <circle cx="65" cy="180" r="12" fill="#f8fafc" />
        <line x1="74" y1="184" x2="84" y2="188" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <path d="M84 188 L145 196 L142 208 L82 202 Z" fill="url(#kpTorso2)" />
        <polyline points="88,193 68,172 88,214" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="88" cy="215" rx="8" ry="3.5" fill="#65a30d" />
        <line x1="142" y1="202" x2="185" y2="210" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="187" cy="212" rx="9" ry="5" fill="#65a30d" />
        <line x1="187" y1="212" x2="220" y2="190" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="221" cy="189" rx="5" ry="3.5" fill="#65a30d" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#ccff00" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        কনুই ৪৫° রেখে বুক মেঝের কাছে নামান ও তুলুন
      </text>
    </svg>
  );
}

function GobletSquatTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Goblet Squat 2-step equipment guide"
    >
      <defs>
        <linearGradient id="gsBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="gsTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="gsTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="gsDbGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#94a3b8" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#gsBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (STANDING WITH CHEST DUMBBELL) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#38bdf8" />
      <text x="48" y="33" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Vertical Alignment Guideline */}
      <line x1="150" y1="85" x2="150" y2="255" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

      {/* Cue badge */}
      <rect x="45" y="60" width="115" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="0.8" />
      <text x="102" y="74" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="monospace">
        বুকে ডাম্বেল উল্লম্ব
      </text>

      {/* Step 1 Figure */}
      <g transform="translate(150, 75)">
        {/* Head */}
        <circle cx="0" cy="15" r="13" fill="#cbd5e1" />
        {/* Neck */}
        <line x1="0" y1="28" x2="0" y2="36" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        {/* Torso */}
        <rect x="-13" y="36" width="26" height="52" rx="7" fill="url(#gsTorso1)" />
        {/* Hips & Legs */}
        <path d="M-8 88 L-16 142 L-18 180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 88 L16 142 L18 180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Feet */}
        <ellipse cx="-23" cy="182" rx="9" ry="4" fill="#0284c7" />
        <ellipse cx="23" cy="182" rx="9" ry="4" fill="#0284c7" />

        {/* Arms holding dumbbell at chest */}
        <path d="M-13 44 L-22 66 L-6 68" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M13 44 L22 66 L6 68" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Vertical Goblet Dumbbell at chest */}
        <g transform="translate(0, 64)">
          <rect x="-11" y="-12" width="22" height="7" rx="2" fill="url(#gsDbGrad)" stroke="#38bdf8" strokeWidth="0.8" />
          <rect x="-3" y="-5" width="6" height="15" rx="1" fill="#cbd5e1" />
          <rect x="-11" y="10" width="22" height="7" rx="2" fill="url(#gsDbGrad)" stroke="#38bdf8" strokeWidth="0.8" />
          <circle cx="-7" cy="-7" r="4" fill="#0284c7" />
          <circle cx="7" cy="-7" r="4" fill="#0284c7" />
        </g>
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        পা কাঁধের সমান চওড়া রেখে ডাম্বেল বুকের সাথে আঁকড়ে ধরুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (DEEP SQUAT WITH TUCKED ELBOWS) ================= */}
      <rect x="325" y="16" width="160" height="26" rx="13" fill="#2563eb" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#60a5fa" />
      <text x="348" y="33" fill="#93c5fd" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: ডিপ স্কোয়াট
      </text>

      {/* Parallel Thigh & Depth Guide */}
      <line x1="365" y1="210" x2="535" y2="210" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
      <rect x="440" y="60" width="125" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#60a5fa" strokeWidth="0.8" />
      <text x="502" y="74" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="700" fontFamily="monospace">
        কনুই হাঁটুর ভেতরে • ৯০°
      </text>

      {/* Downward Squat Arrow */}
      <path d="M380 130 L380 165" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="376,163 384,163 380,170" fill="#38bdf8" />

      {/* Step 2 Figure (Deep Squat) */}
      <g transform="translate(450, 115)">
        {/* Head */}
        <circle cx="0" cy="10" r="13" fill="#f8fafc" />
        {/* Neck */}
        <line x1="0" y1="23" x2="0" y2="30" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        {/* Torso (slight forward lean, neutral flat spine) */}
        <path d="M-13 30 L13 30 L10 82 L-10 82 Z" fill="url(#gsTorso2)" />
        {/* Deep Hips & Legs - thigh parallel to floor at y=95 */}
        <path d="M-10 82 L-32 94 L-28 142" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M10 82 L32 94 L28 142" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Feet */}
        <ellipse cx="-33" cy="144" rx="10" ry="4" fill="#2563eb" />
        <ellipse cx="33" cy="144" rx="10" ry="4" fill="#2563eb" />

        {/* Arms holding dumbbell, elbows tucked inside the knees */}
        <path d="M-12 36 L-18 64 L-6 66" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M12 36 L18 64 L6 66" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Goblet Dumbbell at chest */}
        <g transform="translate(0, 60)">
          <rect x="-11" y="-12" width="22" height="7" rx="2" fill="url(#gsDbGrad)" stroke="#60a5fa" strokeWidth="0.8" />
          <rect x="-3" y="-5" width="6" height="15" rx="1" fill="#f8fafc" />
          <rect x="-11" y="10" width="22" height="7" rx="2" fill="url(#gsDbGrad)" stroke="#60a5fa" strokeWidth="0.8" />
          <circle cx="-7" cy="-7" r="4" fill="#2563eb" />
          <circle cx="7" cy="-7" r="4" fill="#2563eb" />
        </g>
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        নিতম্ব হাঁটু বরাবর নামান, বুক সোজা রেখে হিল দিয়ে পুশ করুন
      </text>
    </svg>
  );
}

function DumbbellBenchPressTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Dumbbell Flat Bench Press 2-step equipment guide"
    >
      <defs>
        <linearGradient id="bpBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="bpTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="bpTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="benchPadsBp" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#334155" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#bpBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (LOWERED TO CHEST, 45° ELBOWS) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#0891b2" fillOpacity="0.25" stroke="#22d3ee" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#22d3ee" />
      <text x="48" y="33" fill="#67e8f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="85" y="55" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#22d3ee" strokeWidth="0.8" />
      <text x="150" y="69" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="monospace">
        বুকের কাছে ডাম্বেল • ৪৫° কনুই
      </text>

      {/* Step 1 Bench & Athlete */}
      <g transform="translate(20, 20)">
        {/* Bench Legs and Base */}
        <rect x="65" y="195" width="8" height="47" rx="2" fill="#475569" />
        <rect x="180" y="195" width="8" height="47" rx="2" fill="#475569" />
        <line x1="55" y1="242" x2="85" y2="242" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <line x1="170" y1="242" x2="200" y2="242" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        {/* Bench Flat Pad */}
        <rect x="45" y="186" width="155" height="12" rx="3" fill="url(#benchPadsBp)" stroke="#64748b" strokeWidth="1" />

        {/* Head on Bench */}
        <circle cx="68" cy="177" r="11" fill="#cbd5e1" />
        {/* Torso lying flat on bench */}
        <rect x="80" y="172" width="75" height="15" rx="5" fill="url(#bpTorso1)" />
        {/* Hips & Bent Leg down to floor */}
        <path d="M152 178 L185 186 L200 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="206" cy="242" rx="8" ry="3.5" fill="#0891b2" />

        {/* Bent Arm with Dumbbell at chest level */}
        <path d="M116 173 L106 150 L124 135" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Dumbbell held horizontally */}
        <g transform="translate(124, 133)">
          <rect x="-14" y="-7" width="6" height="14" rx="1.5" fill="#94a3b8" stroke="#22d3ee" strokeWidth="0.8" />
          <rect x="-9" y="-2" width="18" height="4" rx="1" fill="#cbd5e1" />
          <rect x="8" y="-7" width="6" height="14" rx="1.5" fill="#94a3b8" stroke="#22d3ee" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3.5" fill="#0891b2" />
        </g>
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        বেঞ্চে চিত হয়ে শুয়ে পা মেঝেতে রাখুন এবং ডাম্বেল বুকে নামান
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (VERTICAL PRESS OVER MID-CHEST) ================= */}
      <rect x="325" y="16" width="155" height="26" rx="13" fill="#06b6d4" fillOpacity="0.25" stroke="#22d3ee" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#22d3ee" />
      <text x="348" y="33" fill="#67e8f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: প্রেস আপ
      </text>

      {/* Press Up Motion Arrows */}
      <path d="M425 125 L425 90" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="421,92 429,92 425,85" fill="#22d3ee" />

      {/* Cue badge */}
      <rect x="385" y="55" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#22d3ee" strokeWidth="0.8" />
      <text x="450" y="69" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="monospace">
        ভার্টিকাল প্রেস • চেস্ট স্কুইজ
      </text>

      {/* Step 2 Bench & Athlete */}
      <g transform="translate(320, 20)">
        {/* Bench Legs and Base */}
        <rect x="65" y="195" width="8" height="47" rx="2" fill="#475569" />
        <rect x="180" y="195" width="8" height="47" rx="2" fill="#475569" />
        <line x1="55" y1="242" x2="85" y2="242" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <line x1="170" y1="242" x2="200" y2="242" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        {/* Bench Flat Pad */}
        <rect x="45" y="186" width="155" height="12" rx="3" fill="url(#benchPadsBp)" stroke="#64748b" strokeWidth="1" />

        {/* Head on Bench */}
        <circle cx="68" cy="177" r="11" fill="#f8fafc" />
        {/* Torso lying flat on bench */}
        <rect x="80" y="172" width="75" height="15" rx="5" fill="url(#bpTorso2)" />
        {/* Hips & Bent Leg down to floor */}
        <path d="M152 178 L185 186 L200 240" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="206" cy="242" rx="8" ry="3.5" fill="#0891b2" />

        {/* Fully Extended Arm Pressing Dumbbell Straight Up */}
        <line x1="116" y1="173" x2="116" y2="95" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />
        {/* Dumbbell held horizontally directly overhead */}
        <g transform="translate(116, 88)">
          <rect x="-14" y="-7" width="6" height="14" rx="1.5" fill="#94a3b8" stroke="#22d3ee" strokeWidth="0.8" />
          <rect x="-9" y="-2" width="18" height="4" rx="1" fill="#f8fafc" />
          <rect x="8" y="-7" width="6" height="14" rx="1.5" fill="#94a3b8" stroke="#22d3ee" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3.5" fill="#0891b2" />
        </g>
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        ডাম্বেল দুটি ওপরের দিকে প্রেস করে বুকের পেশী সংকুচিত করুন
      </text>
    </svg>
  );
}

function LatPulldownTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Lat Pulldown Machine 2-step equipment guide"
    >
      <defs>
        <linearGradient id="lpBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="lpTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="lpTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#lpBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (FULL OVERHEAD STRETCH) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#4338ca" fillOpacity="0.25" stroke="#818cf8" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#818cf8" />
      <text x="48" y="33" fill="#c7d2fe" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="40" y="55" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#818cf8" strokeWidth="0.8" />
      <text x="105" y="69" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="700" fontFamily="monospace">
        হাত প্রসারিত • ল্যাটস স্ট্রেচ
      </text>

      {/* Step 1 Pulldown Machine & Athlete */}
      <g transform="translate(20, 20)">
        {/* Machine Frame & Top Pulley Bar */}
        <line x1="175" y1="30" x2="175" y2="242" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
        <line x1="125" y1="30" x2="185" y2="30" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <circle cx="130" cy="30" r="7" fill="#64748b" />

        {/* Seat & Thigh Roller Pad */}
        <rect x="85" y="190" width="45" height="10" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <line x1="105" y1="200" x2="105" y2="242" stroke="#475569" strokeWidth="6" />
        <rect x="120" y="162" width="16" height="12" rx="6" fill="#475569" stroke="#818cf8" strokeWidth="0.8" />

        {/* Overhead Pulley Cable down to Bar */}
        <line x1="130" y1="35" x2="130" y2="68" stroke="#94a3b8" strokeWidth="2" />
        {/* Lat Pulldown Wide Angled Bar (high overhead) */}
        <path d="M90 76 L130 68 L170 76" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Athlete Seated Under Thigh Pad */}
        <path d="M105 188 L130 170 L135 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="140" cy="242" rx="8" ry="3.5" fill="#4f46e5" />
        {/* Torso upright with slight natural arch */}
        <path d="M98 188 L104 125 L118 125 L112 188 Z" fill="url(#lpTorso1)" />
        {/* Head looking slightly up */}
        <circle cx="112" cy="112" r="11" fill="#cbd5e1" />
        {/* Arms stretched overhead reaching bar */}
        <path d="M106 130 L100 95 L95 76" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M116 130 L125 95 L165 76" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        উরু প্যাডের নিচে লক করে চওড়া গ্রিপে বারটি উপরে ধরুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (PULLDOWN TO UPPER CHEST) ================= */}
      <rect x="325" y="16" width="160" height="26" rx="13" fill="#4f46e5" fillOpacity="0.25" stroke="#a5b4fc" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#a5b4fc" />
      <text x="348" y="33" fill="#e0e7ff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: পুলডাউন
      </text>

      {/* Pull Down Motion Arrows */}
      <path d="M430 75 L430 110" stroke="#818cf8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="426,108 434,108 430,115" fill="#818cf8" />

      {/* Cue badge */}
      <rect x="420" y="55" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#a5b4fc" strokeWidth="0.8" />
      <text x="492" y="69" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="700" fontFamily="monospace">
        কলারবোনে বার • ল্যাটস স্কুইজ
      </text>

      {/* Step 2 Pulldown Machine & Athlete */}
      <g transform="translate(320, 20)">
        {/* Machine Frame & Top Pulley Bar */}
        <line x1="175" y1="30" x2="175" y2="242" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
        <line x1="125" y1="30" x2="185" y2="30" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <circle cx="130" cy="30" r="7" fill="#64748b" />

        {/* Seat & Thigh Roller Pad */}
        <rect x="85" y="190" width="45" height="10" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <line x1="105" y1="200" x2="105" y2="242" stroke="#475569" strokeWidth="6" />
        <rect x="120" y="162" width="16" height="12" rx="6" fill="#475569" stroke="#818cf8" strokeWidth="0.8" />

        {/* Pulley Cable pulled down to chin/chest level */}
        <line x1="130" y1="35" x2="130" y2="120" stroke="#94a3b8" strokeWidth="2" />
        {/* Lat Bar pulled to upper chest */}
        <path d="M92 128 L130 120 L168 128" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Athlete Seated - leaning slightly back, driving elbows down */}
        <path d="M105 188 L130 170 L135 240" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="140" cy="242" rx="8" ry="3.5" fill="#6366f1" />
        {/* Torso arched slightly back */}
        <path d="M95 188 L103 125 L117 125 L109 188 Z" fill="url(#lpTorso2)" />
        {/* Head */}
        <circle cx="110" cy="112" r="11" fill="#f8fafc" />

        {/* Arms driving elbows down and back toward ribs */}
        <path d="M104 130 L88 152 L95 128" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M116 130 L138 152 L165 128" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        কনুই নিচের দিকে টেনে বার কলারবোনে আনুন এবং ল্যাটস স্কুইজ করুন
      </text>
    </svg>
  );
}

function DumbbellRDLTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Dumbbell Romanian Deadlift (RDL) 2-step equipment guide"
    >
      <defs>
        <linearGradient id="rdlBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="rdlTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="rdlTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#rdlBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (STANDING UPRIGHT WITH DUMBBELLS) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#047857" fillOpacity="0.25" stroke="#34d399" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#34d399" />
      <text x="48" y="33" fill="#a7f3d0" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="60" y="55" width="125" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#34d399" strokeWidth="0.8" />
      <text x="122" y="69" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="700" fontFamily="monospace">
        সোজা মেরুদণ্ড • কাঁধ লক
      </text>

      {/* Step 1 Figure (Standing Tall with Dumbbells at front) */}
      <g transform="translate(150, 75)">
        {/* Head */}
        <circle cx="0" cy="15" r="13" fill="#cbd5e1" />
        {/* Torso */}
        <rect x="-12" y="34" width="24" height="54" rx="6" fill="url(#rdlTorso1)" />
        {/* Legs: hips to knees, knees to feet with slight soft unlock */}
        <path d="M-8 88 L-10 140 L-10 180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 88 L10 140 L10 180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="-12" cy="182" rx="9" ry="4" fill="#059669" />
        <ellipse cx="12" cy="182" rx="9" ry="4" fill="#059669" />

        {/* Arms hanging in front of thighs with dumbbells */}
        <line x1="-12" y1="42" x2="-8" y2="105" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <line x1="12" y1="42" x2="8" y2="105" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />

        {/* Dumbbells resting against thighs */}
        <g transform="translate(-8, 107)">
          <rect x="-10" y="-5" width="5" height="10" rx="1" fill="#94a3b8" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="5" y="-5" width="5" height="10" rx="1" fill="#94a3b8" />
          <circle cx="0" cy="0" r="3" fill="#059669" />
        </g>
        <g transform="translate(8, 107)">
          <rect x="-10" y="-5" width="5" height="10" rx="1" fill="#94a3b8" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="5" y="-5" width="5" height="10" rx="1" fill="#94a3b8" />
          <circle cx="0" cy="0" r="3" fill="#059669" />
        </g>
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        সোজা হয়ে দাঁড়িয়ে উরুর সামনে দুটি ডাম্বেল স্বাভাবিকভাবে ধরুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (HIP HINGE & HAMSTRING TENSION) ================= */}
      <rect x="325" y="16" width="160" height="26" rx="13" fill="#059669" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#10b981" />
      <text x="348" y="33" fill="#6ee7b7" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: হিপ হিঞ্জ
      </text>

      {/* Hip Hinge Backward Arrow */}
      <g transform="translate(390, 150)">
        <path d="M25 0 L-10 0" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <polygon points="-8,-4 -8,4 -15,0" fill="#10b981" />
        <text x="8" y="-8" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="sans-serif">
          হিপ পেছনে
        </text>
      </g>

      {/* Cue badge */}
      <rect x="420" y="55" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#10b981" strokeWidth="0.8" />
      <text x="492" y="69" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700" fontFamily="monospace">
        হ্যামস্ট্রিং লোডেড • পিঠ সমতল
      </text>

      {/* Step 2 Figure (Hinged Forward, Dumbbells sliding down shins) */}
      <g transform="translate(450, 75)">
        {/* Head in line with torso */}
        <circle cx="36" cy="48" r="13" fill="#f8fafc" />
        {/* Flat Torso hinged at ~45-50 degrees */}
        <path d="M-22 96 L28 62 L22 50 L-26 84 Z" fill="url(#rdlTorso2)" />

        {/* Hips pushed back, slight knee bend, vertical shins */}
        <path d="M-22 96 L-10 138 L-8 180" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Foot */}
        <ellipse cx="-4" cy="182" rx="9" ry="4" fill="#059669" />

        {/* Arms hanging straight down vertically under shoulders */}
        <line x1="20" y1="62" x2="16" y2="135" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />

        {/* Dumbbells hanging at knee/mid-shin height close to legs */}
        <g transform="translate(16, 138)">
          <rect x="-12" y="-6" width="6" height="12" rx="1.5" fill="#94a3b8" stroke="#10b981" strokeWidth="0.8" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#f8fafc" strokeWidth="3" />
          <rect x="6" y="-6" width="6" height="12" rx="1.5" fill="#94a3b8" stroke="#10b981" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3.5" fill="#059669" />
        </g>
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        হাঁটু স্থির রেখে নিতম্ব পেছনে ঠেলুন, ডাম্বেল শিন পর্যন্ত নামান
      </text>
    </svg>
  );
}

function SeatedShoulderPressTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Seated Dumbbell Shoulder Press 2-step equipment guide"
    >
      <defs>
        <linearGradient id="spBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="spTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="spTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="benchPadsSp" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#334155" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#spBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (SEATED WITH DUMBBELLS AT EAR LEVEL) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#b45309" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#fbbf24" />
      <text x="48" y="33" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="65" y="55" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#fbbf24" strokeWidth="0.8" />
      <text x="130" y="69" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700" fontFamily="monospace">
        কানের লেভেলে • পিঠ সোজা
      </text>

      {/* Step 1 Seated Bench & Athlete */}
      <g transform="translate(20, 20)">
        {/* Upright Bench Frame & Backrest Pad */}
        <line x1="102" y1="100" x2="102" y2="242" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <rect x="94" y="105" width="14" height="95" rx="3" fill="url(#benchPadsSp)" stroke="#64748b" strokeWidth="1" />
        {/* Seat Pad */}
        <rect x="100" y="196" width="46" height="10" rx="2" fill="url(#benchPadsSp)" stroke="#64748b" strokeWidth="1" />
        <line x1="120" y1="206" x2="120" y2="242" stroke="#475569" strokeWidth="6" />

        {/* Head against upright backrest */}
        <circle cx="118" cy="95" r="11" fill="#cbd5e1" />
        {/* Torso upright against backrest */}
        <rect x="110" y="108" width="22" height="58" rx="5" fill="url(#spTorso1)" />

        {/* Hips and Bent Leg down to floor */}
        <path d="M122 196 L148 196 L154 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="160" cy="242" rx="8" ry="3.5" fill="#d97706" />

        {/* Arm bent at 90° with dumbbell at ear level */}
        <path d="M126 114 L146 138 L146 108" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Dumbbell held horizontally at ear level */}
        <g transform="translate(146, 104)">
          <rect x="-12" y="-5" width="5" height="10" rx="1.5" fill="#94a3b8" stroke="#fbbf24" strokeWidth="0.8" />
          <rect x="-7" y="-2" width="14" height="4" rx="1" fill="#cbd5e1" />
          <rect x="7" y="-5" width="5" height="10" rx="1.5" fill="#94a3b8" stroke="#fbbf24" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill="#d97706" />
        </g>
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        খাড়া বেঞ্চে পিঠ লাগিয়ে বসে ডাম্বেল কানের লেভেলে রাখুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (VERTICAL OVERHEAD PRESS) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#d97706" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#f59e0b" />
      <text x="348" y="33" fill="#fef3c7" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: ওভারহেড প্রেস
      </text>

      {/* Overhead Press Motion Arrows */}
      <path d="M465 95 L465 65" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="461,67 469,67 465,60" fill="#f59e0b" />

      {/* Cue badge */}
      <rect x="405" y="55" width="150" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="480" y="69" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="monospace">
        উল্লম্ব প্রেস • শোল্ডার লক
      </text>

      {/* Step 2 Seated Bench & Athlete */}
      <g transform="translate(320, 20)">
        {/* Upright Bench Frame & Backrest Pad */}
        <line x1="102" y1="100" x2="102" y2="242" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <rect x="94" y="105" width="14" height="95" rx="3" fill="url(#benchPadsSp)" stroke="#64748b" strokeWidth="1" />
        {/* Seat Pad */}
        <rect x="100" y="196" width="46" height="10" rx="2" fill="url(#benchPadsSp)" stroke="#64748b" strokeWidth="1" />
        <line x1="120" y1="206" x2="120" y2="242" stroke="#475569" strokeWidth="6" />

        {/* Head */}
        <circle cx="118" cy="95" r="11" fill="#f8fafc" />
        {/* Torso */}
        <rect x="110" y="108" width="22" height="58" rx="5" fill="url(#spTorso2)" />

        {/* Hips and Leg down to floor */}
        <path d="M122 196 L148 196 L154 240" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="160" cy="242" rx="8" ry="3.5" fill="#b45309" />

        {/* Arm extended straight up overhead */}
        <line x1="124" y1="112" x2="135" y2="48" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />

        {/* Dumbbell held horizontally directly overhead */}
        <g transform="translate(136, 42)">
          <rect x="-12" y="-5" width="5" height="10" rx="1.5" fill="#94a3b8" stroke="#f59e0b" strokeWidth="0.8" />
          <rect x="-7" y="-2" width="14" height="4" rx="1" fill="#f8fafc" />
          <rect x="7" y="-5" width="5" height="10" rx="1.5" fill="#94a3b8" stroke="#f59e0b" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill="#b45309" />
        </g>
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        শ্বাস ফেলে ডাম্বেল সোজা মাথার ওপর প্রেস করুন এবং মসৃণভাবে নামান
      </text>
    </svg>
  );
}

function BarbellBackSquatTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Barbell Back Squat 2-step equipment guide"
    >
      <defs>
        <linearGradient id="bbsBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="bbsTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="bbsTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#bbsBg)" />

      {/* Floor & Guidelines */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (BARBELL UN-RACKED ON TRAPS) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#b45309" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#fbbf24" />
      <text x="48" y="33" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="45" y="55" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#fbbf24" strokeWidth="0.8" />
      <text x="110" y="69" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700" fontFamily="monospace">
        ট্র্যাপসে বারবেল • পিঠ সোজা
      </text>

      {/* Step 1 Lifter Standing with Barbell */}
      <g transform="translate(150, 75)">
        {/* Head */}
        <circle cx="0" cy="15" r="13" fill="#cbd5e1" />
        {/* Torso upright */}
        <rect x="-13" y="36" width="26" height="52" rx="6" fill="url(#bbsTorso1)" />

        {/* Legs standing straight */}
        <path d="M-8 88 L-14 142 L-16 180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 88 L14 142 L16 180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="-20" cy="182" rx="9" ry="4" fill="#d97706" />
        <ellipse cx="20" cy="182" rx="9" ry="4" fill="#d97706" />

        {/* Olympic Barbell across upper traps */}
        <line x1="-65" y1="36" x2="65" y2="36" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        {/* Weight Plates on barbell */}
        <rect x="-62" y="18" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="-54" y="22" width="5" height="28" rx="1.5" fill="#64748b" />
        <rect x="56" y="18" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="49" y="22" width="5" height="28" rx="1.5" fill="#64748b" />

        {/* Arms gripping barbell outside shoulders */}
        <path d="M-13 42 L-36 40 L-42 36" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M13 42 L36 40 L42 36" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="-42" cy="36" r="3.5" fill="#d97706" />
        <circle cx="42" cy="36" r="3.5" fill="#d97706" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        অলিম্পিক বার ট্র্যাপসে সেট করে সোজা দাঁড়িয়ে কোর ব্রেস করুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (PARALLEL 90° SQUAT) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#d97706" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#f59e0b" />
      <text x="348" y="33" fill="#fef3c7" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: প্যারালাল স্কোয়াট
      </text>

      {/* Parallel 90° Depth Guide */}
      <line x1="365" y1="210" x2="535" y2="210" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
      <rect x="430" y="55" width="135" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="497" y="69" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="monospace">
        উরু সমান্তরাল ৯০° • হিল পুশ
      </text>

      {/* Squat Downward Arrow */}
      <path d="M375 130 L375 165" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="371,163 379,163 375,170" fill="#f59e0b" />

      {/* Step 2 Figure (Deep Parallel Squat) */}
      <g transform="translate(450, 115)">
        {/* Head */}
        <circle cx="0" cy="10" r="13" fill="#f8fafc" />
        {/* Torso angled forward with neutral flat back */}
        <path d="M-13 30 L13 30 L10 82 L-10 82 Z" fill="url(#bbsTorso2)" />

        {/* Deep Hips & Legs - thighs parallel to floor at y=95 */}
        <path d="M-10 82 L-34 95 L-30 142" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M10 82 L34 95 L30 142" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="-35" cy="144" rx="10" ry="4" fill="#b45309" />
        <ellipse cx="35" cy="144" rx="10" ry="4" fill="#b45309" />

        {/* Olympic Barbell on traps */}
        <line x1="-65" y1="30" x2="65" y2="30" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <rect x="-62" y="12" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="-54" y="16" width="5" height="28" rx="1.5" fill="#64748b" />
        <rect x="56" y="12" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="49" y="16" width="5" height="28" rx="1.5" fill="#64748b" />

        {/* Arms holding barbell */}
        <path d="M-13 36 L-36 34 L-42 30" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M13 36 L36 34 L42 30" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="-42" cy="30" r="3.5" fill="#b45309" />
        <circle cx="42" cy="30" r="3.5" fill="#b45309" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        বুক উঁচু রেখে উরু মেঝের সমান্তরাল নামান এবং হিল দিয়ে উঠুন
      </text>
    </svg>
  );
}

function BarbellBenchPressTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Barbell Bench Press 2-step equipment guide"
    >
      <defs>
        <linearGradient id="bbpBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="bbpTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f87171" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="bbpTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="benchPadsBbp" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#334155" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#bbpBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (BARBELL TOUCH TO LOWER-MID CHEST) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#991b1b" fillOpacity="0.25" stroke="#f87171" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#f87171" />
      <text x="48" y="33" fill="#fca5a5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="85" y="55" width="135" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#f87171" strokeWidth="0.8" />
      <text x="152" y="69" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="700" fontFamily="monospace">
        বুকে হালকা স্পর্শ • উল্লম্ব ফোরআর্ম
      </text>

      {/* Step 1 Bench, Rack, & Athlete */}
      <g transform="translate(20, 20)">
        {/* Squat/Bench Upright Rack */}
        <line x1="60" y1="120" x2="60" y2="242" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <path d="M56 145 L68 145 L68 152" stroke="#94a3b8" strokeWidth="3" fill="none" />

        {/* Bench Structure */}
        <rect x="65" y="195" width="8" height="47" rx="2" fill="#475569" />
        <rect x="180" y="195" width="8" height="47" rx="2" fill="#475569" />
        <line x1="55" y1="242" x2="85" y2="242" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <line x1="170" y1="242" x2="200" y2="242" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <rect x="45" y="186" width="155" height="12" rx="3" fill="url(#benchPadsBbp)" stroke="#64748b" strokeWidth="1" />

        {/* Head on Bench */}
        <circle cx="68" cy="177" r="11" fill="#cbd5e1" />
        {/* Torso lying flat on bench */}
        <rect x="80" y="172" width="75" height="15" rx="5" fill="url(#bbpTorso1)" />
        {/* Hips & Bent Leg down to floor */}
        <path d="M152 178 L185 186 L200 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="206" cy="242" rx="8" ry="3.5" fill="#dc2626" />

        {/* Arms holding barbell down at mid-chest */}
        <path d="M116 173 L106 154 L122 142" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Olympic Barbell touching lower-mid chest */}
        <line x1="75" y1="140" x2="175" y2="140" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <rect x="73" y="122" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="169" y="122" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="122" cy="140" r="3.5" fill="#dc2626" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        বেঞ্চে চিত হয়ে শুয়ে বারবেল বুকের মাঝামাঝি আলতো স্পর্শ করান
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (VERTICAL BARBELL PRESS) ================= */}
      <rect x="325" y="16" width="160" height="26" rx="13" fill="#dc2626" fillOpacity="0.25" stroke="#f87171" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#f87171" />
      <text x="348" y="33" fill="#fca5a5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: প্রেস আপ
      </text>

      {/* Press Up Motion Arrows */}
      <path d="M425 125 L425 90" stroke="#f87171" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="421,92 429,92 425,85" fill="#f87171" />

      {/* Cue badge */}
      <rect x="385" y="55" width="135" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#f87171" strokeWidth="0.8" />
      <text x="452" y="69" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="700" fontFamily="monospace">
        উল্লম্ব প্রেস • চেস্ট ও ট্রাইসেপস
      </text>

      {/* Step 2 Bench, Rack, & Athlete */}
      <g transform="translate(320, 20)">
        {/* Squat/Bench Upright Rack */}
        <line x1="60" y1="120" x2="60" y2="242" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <path d="M56 145 L68 145 L68 152" stroke="#94a3b8" strokeWidth="3" fill="none" />

        {/* Bench Structure */}
        <rect x="65" y="195" width="8" height="47" rx="2" fill="#475569" />
        <rect x="180" y="195" width="8" height="47" rx="2" fill="#475569" />
        <line x1="55" y1="242" x2="85" y2="242" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <line x1="170" y1="242" x2="200" y2="242" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <rect x="45" y="186" width="155" height="12" rx="3" fill="url(#benchPadsBbp)" stroke="#64748b" strokeWidth="1" />

        {/* Head on Bench */}
        <circle cx="68" cy="177" r="11" fill="#f8fafc" />
        {/* Torso lying flat on bench */}
        <rect x="80" y="172" width="75" height="15" rx="5" fill="url(#bbpTorso2)" />
        {/* Hips & Bent Leg down to floor */}
        <path d="M152 178 L185 186 L200 240" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="206" cy="242" rx="8" ry="3.5" fill="#dc2626" />

        {/* Extended Arms Pressing Barbell Up */}
        <line x1="116" y1="173" x2="116" y2="92" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />

        {/* Olympic Barbell at top */}
        <line x1="75" y1="90" x2="175" y2="90" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <rect x="73" y="72" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="169" y="72" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="116" cy="90" r="3.5" fill="#dc2626" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        শ্বাস ছেড়ে বারবেল সোজা ওপরে প্রেস করুন এবং বুক সংকুচিত করুন
      </text>
    </svg>
  );
}

function BentOverRowTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Bent-Over Barbell Row 2-step equipment guide"
    >
      <defs>
        <linearGradient id="borBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="borTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="borTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#borBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (45° HINGE WITH EXTENDED ARMS) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#047857" fillOpacity="0.25" stroke="#34d399" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#34d399" />
      <text x="48" y="33" fill="#a7f3d0" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="55" y="55" width="130" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#34d399" strokeWidth="0.8" />
      <text x="120" y="69" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৪৫° হিপ হিঞ্জ • পিঠ ফ্ল্যাট
      </text>

      {/* Step 1 Hinged Lifter Holding Barbell Hanging */}
      <g transform="translate(150, 75)">
        {/* Head */}
        <circle cx="36" cy="48" r="13" fill="#cbd5e1" />
        {/* Flat Torso hinged at 45 degrees */}
        <path d="M-22 96 L28 62 L22 50 L-26 84 Z" fill="url(#borTorso1)" />

        {/* Legs: knees slightly flexed, hips back */}
        <path d="M-22 96 L-10 138 L-8 180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="-4" cy="182" rx="9" ry="4" fill="#059669" />

        {/* Extended arms hanging straight down */}
        <line x1="20" y1="62" x2="16" y2="135" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />

        {/* Olympic Barbell hanging below knees */}
        <line x1="-35" y1="138" x2="65" y2="138" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <rect x="-33" y="120" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="57" y="120" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="16" cy="138" r="3.5" fill="#059669" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        ধড় ৪৫° কোণে ঝুঁকিয়ে পিঠ সমতল রেখে বারবেল সোজা নিচে ঝুলিয়ে রাখুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (PULL BARBELL TO NAVEL) ================= */}
      <rect x="325" y="16" width="160" height="26" rx="13" fill="#059669" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#10b981" />
      <text x="348" y="33" fill="#6ee7b7" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: বারবেল রো
      </text>

      {/* Pull Upward Motion Arrow */}
      <path d="M465 180 L465 145" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="461,148 469,148 465,140" fill="#10b981" />

      {/* Cue badge */}
      <rect x="420" y="55" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#10b981" strokeWidth="0.8" />
      <text x="492" y="69" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700" fontFamily="monospace">
        নাভিতে বার • ল্যাটস স্কুইজ
      </text>

      {/* Step 2 Figure (Barbell Rowed to Navel) */}
      <g transform="translate(450, 75)">
        {/* Head */}
        <circle cx="36" cy="48" r="13" fill="#f8fafc" />
        {/* Flat Torso hinged at 45 degrees */}
        <path d="M-22 96 L28 62 L22 50 L-26 84 Z" fill="url(#borTorso2)" />

        {/* Legs: knees slightly flexed, hips back */}
        <path d="M-22 96 L-10 138 L-8 180" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="-4" cy="182" rx="9" ry="4" fill="#047857" />

        {/* Arms pulling up, elbow driving back toward ceiling */}
        <path d="M20 62 L32 88 L6 94" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Olympic Barbell pulled into navel/lower abdomen */}
        <line x1="-45" y1="94" x2="55" y2="94" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <rect x="-43" y="76" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="47" y="76" width="6" height="36" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="6" cy="94" r="3.5" fill="#047857" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        কনুই পেছনে টেনে বারবেল নাভির দিকে টানুন এবং পিঠ স্কুইজ করুন
      </text>
    </svg>
  );
}

function InclineDumbbellPressTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Incline Dumbbell Press 2-step equipment guide"
    >
      <defs>
        <linearGradient id="idpBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="idpTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="idpTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="benchPadsIdp" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#334155" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#idpBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (DUMBBELLS AT UPPER CHEST) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#0891b2" fillOpacity="0.25" stroke="#22d3ee" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#22d3ee" />
      <text x="48" y="33" fill="#67e8f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="65" y="55" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#22d3ee" strokeWidth="0.8" />
      <text x="137" y="69" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৩০-৪৫° ইনক্লাইন • আপার চেস্ট
      </text>

      {/* Step 1 Incline Bench & Athlete */}
      <g transform="translate(20, 20)">
        {/* Incline Bench (Backrest angled at ~35-40°) */}
        <line x1="75" y1="120" x2="135" y2="200" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <line x1="130" y1="200" x2="175" y2="200" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <line x1="90" y1="145" x2="90" y2="242" stroke="#475569" strokeWidth="5" />
        <line x1="150" y1="200" x2="150" y2="242" stroke="#475569" strokeWidth="5" />

        {/* Incline Backrest Pad */}
        <line x1="75" y1="120" x2="135" y2="200" stroke="url(#benchPadsIdp)" strokeWidth="14" strokeLinecap="round" />
        {/* Seat Pad */}
        <line x1="135" y1="200" x2="170" y2="200" stroke="url(#benchPadsIdp)" strokeWidth="12" strokeLinecap="round" />

        {/* Head on incline pad */}
        <circle cx="85" cy="115" r="11" fill="#cbd5e1" />
        {/* Torso reclined along incline angle */}
        <path d="M88 126 L128 186 L118 192 L78 132 Z" fill="url(#idpTorso1)" />
        {/* Hips on seat, bent leg down to floor */}
        <path d="M125 190 L160 196 L175 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="180" cy="242" rx="8" ry="3.5" fill="#0891b2" />

        {/* Arms holding dumbbell at upper chest level */}
        <path d="M104 148 L96 168 L112 152" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Dumbbell held at angle */}
        <g transform="translate(112, 146)">
          <rect x="-12" y="-5" width="5" height="10" rx="1.5" fill="#94a3b8" stroke="#22d3ee" strokeWidth="0.8" />
          <rect x="-7" y="-2" width="14" height="4" rx="1" fill="#cbd5e1" />
          <rect x="7" y="-5" width="5" height="10" rx="1.5" fill="#94a3b8" stroke="#22d3ee" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3.5" fill="#0891b2" />
        </g>
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        ইনক্লাইন বেঞ্চে শুয়ে ডাম্বেল দুটি উপরের বুকের দুই পাশে রাখুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (UPPER CHEST VERTICAL PRESS) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#06b6d4" fillOpacity="0.25" stroke="#22d3ee" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#22d3ee" />
      <text x="348" y="33" fill="#67e8f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: আপার চেস্ট প্রেস
      </text>

      {/* Upward Press Motion Arrows */}
      <path d="M435 110 L435 75" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="431,77 439,77 435,70" fill="#22d3ee" />

      {/* Cue badge */}
      <rect x="390" y="55" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#22d3ee" strokeWidth="0.8" />
      <text x="462" y="69" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="monospace">
        আপার চেস্ট প্রেস • কনভার্জিং
      </text>

      {/* Step 2 Incline Bench & Athlete */}
      <g transform="translate(320, 20)">
        {/* Incline Bench */}
        <line x1="75" y1="120" x2="135" y2="200" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <line x1="130" y1="200" x2="175" y2="200" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <line x1="90" y1="145" x2="90" y2="242" stroke="#475569" strokeWidth="5" />
        <line x1="150" y1="200" x2="150" y2="242" stroke="#475569" strokeWidth="5" />

        <line x1="75" y1="120" x2="135" y2="200" stroke="url(#benchPadsIdp)" strokeWidth="14" strokeLinecap="round" />
        <line x1="135" y1="200" x2="170" y2="200" stroke="url(#benchPadsIdp)" strokeWidth="12" strokeLinecap="round" />

        {/* Head */}
        <circle cx="85" cy="115" r="11" fill="#f8fafc" />
        {/* Torso */}
        <path d="M88 126 L128 186 L118 192 L78 132 Z" fill="url(#idpTorso2)" />
        {/* Hips & Legs */}
        <path d="M125 190 L160 196 L175 240" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="180" cy="242" rx="8" ry="3.5" fill="#0891b2" />

        {/* Arms fully extended pressing dumbbells upward */}
        <line x1="104" y1="148" x2="118" y2="78" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />

        {/* Dumbbell held at top */}
        <g transform="translate(118, 72)">
          <rect x="-12" y="-5" width="5" height="10" rx="1.5" fill="#94a3b8" stroke="#22d3ee" strokeWidth="0.8" />
          <rect x="-7" y="-2" width="14" height="4" rx="1" fill="#f8fafc" />
          <rect x="7" y="-5" width="5" height="10" rx="1.5" fill="#94a3b8" stroke="#22d3ee" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3.5" fill="#0891b2" />
        </g>
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        ডাম্বেল দুটি ওপরের দিকে প্রেস করে উপরের বুক সংকুচিত করুন
      </text>
    </svg>
  );
}

function LegPressMachineTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="45° Sled Leg Press Machine 2-step equipment guide"
    >
      <defs>
        <linearGradient id="lpBg2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="lpTorso1_2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id="lpTorso2_2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id="sledGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#64748b" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#lpBg2)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (90° KNEE BEND WITH SLED LOWERED) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#7e22ce" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#c084fc" />
      <text x="48" y="33" fill="#e9d5ff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="55" y="55" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#c084fc" strokeWidth="0.8" />
      <text x="127" y="69" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৯০° হাঁটু ভাঁজ • ব্যাক সাপোর্টেড
      </text>

      {/* Step 1 45° Sled Machine & Lifter */}
      <g transform="translate(20, 20)">
        {/* 45° Incline Sled Track Rails */}
        <line x1="60" y1="230" x2="220" y2="70" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
        <line x1="80" y1="242" x2="240" y2="82" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

        {/* Reclined Seat at bottom */}
        <line x1="65" y1="185" x2="95" y2="225" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
        <line x1="95" y1="225" x2="125" y2="225" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />

        {/* Lifter Seated */}
        <circle cx="70" cy="175" r="11" fill="#cbd5e1" />
        <path d="M74 184 L102 220 L94 224 L66 188 Z" fill="url(#lpTorso1_2)" />

        {/* Legs bent at 90° toward chest */}
        <path d="M100 220 L135 178 L160 135" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="163" cy="132" rx="7" ry="4" fill="#9333ea" />

        {/* 45° Sled Platform lowered at feet */}
        <line x1="145" y1="115" x2="185" y2="155" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
        <rect x="155" y="115" width="28" height="14" rx="3" transform="rotate(-45 155 115)" fill="url(#sledGrad)" stroke="#c084fc" strokeWidth="1" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        পিঠ সিটে লাগিয়ে হাঁটু ৯০° কোণে নামিয়ে আনুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (SLED EXTENDED THROUGH HEELS) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#9333ea" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#c084fc" />
      <text x="348" y="33" fill="#f3e8ff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: স্লেড পুশ
      </text>

      {/* 45° Push Arrow */}
      <g transform="translate(480, 105)">
        <path d="M-15 15 L15 -15" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <polygon points="12,-18 18,-12 18,-18" fill="#c084fc" />
      </g>

      {/* Cue badge */}
      <rect x="390" y="55" width="150" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#c084fc" strokeWidth="0.8" />
      <text x="465" y="69" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="700" fontFamily="monospace">
        হিল পুশ ড্রাইভ • সফট নি লক
      </text>

      {/* Step 2 45° Sled Machine & Lifter */}
      <g transform="translate(320, 20)">
        {/* 45° Incline Sled Track Rails */}
        <line x1="60" y1="230" x2="220" y2="70" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
        <line x1="80" y1="242" x2="240" y2="82" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

        {/* Reclined Seat at bottom */}
        <line x1="65" y1="185" x2="95" y2="225" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
        <line x1="95" y1="225" x2="125" y2="225" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />

        {/* Lifter Seated */}
        <circle cx="70" cy="175" r="11" fill="#f8fafc" />
        <path d="M74 184 L102 220 L94 224 L66 188 Z" fill="url(#lpTorso2_2)" />

        {/* Legs extended pressing sled (soft knee lock) */}
        <path d="M100 220 L155 165 L200 100" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="203" cy="98" rx="7" ry="4" fill="#7e22ce" />

        {/* 45° Sled Platform pushed up along track */}
        <line x1="185" y1="80" x2="225" y2="120" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
        <rect x="195" y="80" width="28" height="14" rx="3" transform="rotate(-45 195 80)" fill="url(#sledGrad)" stroke="#c084fc" strokeWidth="1" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        গোড়ালির শক্তিতে স্লেড ঠেলুন, শীর্ষে হাঁটু সামান্য সফট রাখুন
      </text>
    </svg>
  );
}

function ConventionalDeadliftTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Conventional Barbell Deadlift 2-step equipment guide"
    >
      <defs>
        <linearGradient id="dlBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="dlTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f87171" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="dlTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#dlBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (FLOOR SETUP & NEUTRAL SPINE) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#991b1b" fillOpacity="0.25" stroke="#f87171" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#f87171" />
      <text x="48" y="33" fill="#fca5a5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="55" y="55" width="140" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#f87171" strokeWidth="0.8" />
      <text x="125" y="69" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="700" fontFamily="monospace">
        ফ্লোর সেটআপ • সোজা পিঠ
      </text>

      {/* Step 1 Deadlift Setup from Floor */}
      <g transform="translate(150, 75)">
        {/* Head in line with torso */}
        <circle cx="38" cy="72" r="13" fill="#cbd5e1" />
        {/* Flat Torso angled from hips down to shoulders */}
        <path d="M-20 115 L28 85 L22 74 L-26 104 Z" fill="url(#dlTorso1)" />

        {/* Legs: hips back and above knees, knees flexed, shins close to bar */}
        <path d="M-20 115 L-8 152 L-6 182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="-2" cy="184" rx="9" ry="4" fill="#dc2626" />

        {/* Straight arms gripping barbell on floor */}
        <line x1="22" y1="84" x2="16" y2="162" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />

        {/* Olympic Barbell on Floor with Large Plates */}
        <line x1="-35" y1="164" x2="65" y2="164" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        {/* Big Bumper Plates resting on floor */}
        <circle cx="-32" cy="164" r="18" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="62" cy="164" r="18" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="16" cy="164" r="3.5" fill="#dc2626" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        মেঝেতে রাখা বারবেলে গ্রিপ নিয়ে পিঠ সোজা ও ল্যাটস শক্ত করুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (EXPLOSIVE HIP LOCKOUT) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#dc2626" fillOpacity="0.25" stroke="#f87171" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#f87171" />
      <text x="348" y="33" fill="#fca5a5" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: হিপ লকআউট
      </text>

      {/* Upward Drive Arrow */}
      <path d="M470 170 L470 135" stroke="#f87171" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="466,138 474,138 470,130" fill="#f87171" />

      {/* Cue badge */}
      <rect x="410" y="55" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#f87171" strokeWidth="0.8" />
      <text x="482" y="69" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="700" fontFamily="monospace">
        হিপ ড্রাইভ • স্ট্যান্ডিং লকআউট
      </text>

      {/* Step 2 Figure (Fully Standing Upright with Barbell) */}
      <g transform="translate(450, 75)">
        {/* Head */}
        <circle cx="0" cy="15" r="13" fill="#f8fafc" />
        {/* Torso fully upright */}
        <rect x="-13" y="36" width="26" height="52" rx="6" fill="url(#dlTorso2)" />

        {/* Legs fully extended, glutes locked */}
        <line x1="-8" y1="88" x2="-8" y2="182" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <line x1="8" y1="88" x2="8" y2="182" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-12" cy="184" rx="9" ry="4" fill="#b91c1c" />
        <ellipse cx="12" cy="184" rx="9" ry="4" fill="#b91c1c" />

        {/* Arms hanging holding barbell at mid-thigh */}
        <line x1="-12" y1="44" x2="-8" y2="115" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <line x1="12" y1="44" x2="8" y2="115" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />

        {/* Barbell held at hip/thigh height */}
        <line x1="-55" y1="116" x2="55" y2="116" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <circle cx="-52" cy="116" r="18" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="52" cy="116" r="18" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="-8" cy="116" r="3.5" fill="#b91c1c" />
        <circle cx="8" cy="116" r="3.5" fill="#b91c1c" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        মেঝেতে পা ড্রাইভ করে সোজা দাঁড়িয়ে নিতম্ব লকআউট করুন
      </text>
    </svg>
  );
}

function OverheadMilitaryPressTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Standing Barbell Overhead Military Press 2-step equipment guide"
    >
      <defs>
        <linearGradient id="ompBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="ompTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="ompTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#ompBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (BARBELL RESTING ON CLAVICLE) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#b45309" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#fbbf24" />
      <text x="48" y="33" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="50" y="55" width="140" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#fbbf24" strokeWidth="0.8" />
      <text x="120" y="69" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700" fontFamily="monospace">
        কলারবোনে বারবেল • টাইট কোর
      </text>

      {/* Step 1 Figure (Standing Tall with Barbell at Clavicle) */}
      <g transform="translate(150, 75)">
        {/* Head */}
        <circle cx="0" cy="15" r="13" fill="#cbd5e1" />
        {/* Torso upright */}
        <rect x="-13" y="36" width="26" height="52" rx="6" fill="url(#ompTorso1)" />

        {/* Legs standing tall */}
        <line x1="-8" y1="88" x2="-8" y2="182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <line x1="8" y1="88" x2="8" y2="182" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-12" cy="184" rx="9" ry="4" fill="#d97706" />
        <ellipse cx="12" cy="184" rx="9" ry="4" fill="#d97706" />

        {/* Olympic Barbell at Clavicle/Chest */}
        <line x1="-60" y1="42" x2="60" y2="42" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <rect x="-58" y="26" width="6" height="32" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="52" y="26" width="6" height="32" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />

        {/* Arms holding barbell in front of shoulders */}
        <path d="M-13 42 L-22 62 L-16 44" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M13 42 L22 62 L16 44" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="-16" cy="42" r="3.5" fill="#d97706" />
        <circle cx="16" cy="42" r="3.5" fill="#d97706" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        কলারবোনের কাছে বারবেল রেখে কোর ও গ্লুটস শক্ত করে দাঁড়ান
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (OVERHEAD LOCKOUT) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#d97706" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#f59e0b" />
      <text x="348" y="33" fill="#fef3c7" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: ওভারহেড প্রেস
      </text>

      {/* Overhead Press Arrow */}
      <path d="M450 65 L450 35" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="446,38 454,38 450,30" fill="#f59e0b" />

      {/* Cue badge */}
      <rect x="400" y="55" width="150" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="475" y="69" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="monospace">
        উল্লম্ব লকআউট • হেড থ্রু
      </text>

      {/* Step 2 Figure (Overhead Lockout) */}
      <g transform="translate(450, 75)">
        {/* Head slightly forward through window */}
        <circle cx="0" cy="18" r="13" fill="#f8fafc" />
        {/* Torso straight */}
        <rect x="-13" y="36" width="26" height="52" rx="6" fill="url(#ompTorso2)" />

        {/* Legs straight */}
        <line x1="-8" y1="88" x2="-8" y2="182" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <line x1="8" y1="88" x2="8" y2="182" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-12" cy="184" rx="9" ry="4" fill="#b45309" />
        <ellipse cx="12" cy="184" rx="9" ry="4" fill="#b45309" />

        {/* Arms fully extended straight up */}
        <line x1="-12" y1="42" x2="-14" y2="-12" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
        <line x1="12" y1="42" x2="14" y2="-12" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />

        {/* Barbell held directly overhead */}
        <line x1="-60" y1="-14" x2="60" y2="-14" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <rect x="-58" y="-30" width="6" height="32" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="52" y="-30" width="6" height="32" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="-14" cy="-14" r="3.5" fill="#b45309" />
        <circle cx="14" cy="-14" r="3.5" fill="#b45309" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        বারবেল সোজা মাথার ওপর উল্লম্বভাবে প্রেস করে কনুই লক করুন
      </text>
    </svg>
  );
}

function BulgarianSplitSquatTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Bulgarian Split Squat 2-step equipment guide"
    >
      <defs>
        <linearGradient id="bssBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="bssTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="bssTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="benchBss" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#475569" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#bssBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (REAR FOOT ELEVATED ON BENCH) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#0891b2" fillOpacity="0.25" stroke="#22d3ee" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#22d3ee" />
      <text x="48" y="33" fill="#67e8f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="65" y="55" width="145" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#22d3ee" strokeWidth="0.8" />
      <text x="137" y="69" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="monospace">
        বেঞ্চে পেছনের পা • সোজা ধড়
      </text>

      {/* Step 1 Bench & Lifter */}
      <g transform="translate(20, 20)">
        {/* Flat Bench at rear */}
        <rect x="35" y="196" width="60" height="12" rx="3" fill="url(#benchBss)" stroke="#64748b" strokeWidth="1" />
        <line x1="45" y1="208" x2="45" y2="242" stroke="#475569" strokeWidth="5" />
        <line x1="85" y1="208" x2="85" y2="242" stroke="#475569" strokeWidth="5" />

        {/* Head */}
        <circle cx="150" cy="85" r="12" fill="#cbd5e1" />
        {/* Torso upright */}
        <rect x="138" y="98" width="24" height="52" rx="6" fill="url(#bssTorso1)" />

        {/* Front Leg standing straight */}
        <line x1="150" y1="150" x2="160" y2="240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="166" cy="242" rx="9" ry="4" fill="#0891b2" />

        {/* Rear Leg elevated back on bench */}
        <path d="M142 150 L105 180 L75 196" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="72" cy="195" rx="6" ry="3.5" fill="#0891b2" />

        {/* Dumbbells held in hands at sides */}
        <line x1="140" y1="110" x2="135" y2="165" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        <g transform="translate(135, 168)">
          <rect x="-10" y="-4" width="4" height="8" rx="1" fill="#94a3b8" />
          <rect x="-6" y="-1" width="12" height="3" rx="0.5" fill="#cbd5e1" />
          <rect x="6" y="-4" width="4" height="8" rx="1" fill="#94a3b8" />
          <circle cx="0" cy="0" r="2.5" fill="#0891b2" />
        </g>
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        পেছনের পা বেঞ্চে রেখে দুই হাতে ডাম্বেল নিয়ে সোজা দাঁড়ান
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (DEEP SINGLE LEG 90°) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#06b6d4" fillOpacity="0.25" stroke="#22d3ee" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#22d3ee" />
      <text x="348" y="33" fill="#67e8f9" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: ডিপ স্কোয়াট
      </text>

      {/* Squat Downward Arrow */}
      <path d="M435 130 L435 165" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="431,162 439,162 435,170" fill="#22d3ee" />

      {/* Cue badge */}
      <rect x="390" y="55" width="150" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#22d3ee" strokeWidth="0.8" />
      <text x="465" y="69" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৯০° হাঁটু ভাঁজ • সামনের হিল পুশ
      </text>

      {/* Step 2 Bench & Lifter in Deep Lunge */}
      <g transform="translate(320, 20)">
        {/* Flat Bench */}
        <rect x="35" y="196" width="60" height="12" rx="3" fill="url(#benchBss)" stroke="#64748b" strokeWidth="1" />
        <line x1="45" y1="208" x2="45" y2="242" stroke="#475569" strokeWidth="5" />
        <line x1="85" y1="208" x2="85" y2="242" stroke="#475569" strokeWidth="5" />

        {/* Head */}
        <circle cx="150" cy="120" r="12" fill="#f8fafc" />
        {/* Torso */}
        <rect x="138" y="132" width="24" height="52" rx="6" fill="url(#bssTorso2)" />

        {/* Front Leg bent at 90° */}
        <path d="M150 184 L185 186 L180 240" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="186" cy="242" rx="9" ry="4" fill="#0891b2" />

        {/* Rear Leg deeply bent hovering near floor */}
        <path d="M142 184 L110 225 L75 196" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="72" cy="195" rx="6" ry="3.5" fill="#0891b2" />

        {/* Dumbbells hanging at sides */}
        <line x1="140" y1="144" x2="135" y2="198" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />
        <g transform="translate(135, 202)">
          <rect x="-10" y="-4" width="4" height="8" rx="1" fill="#94a3b8" />
          <rect x="-6" y="-1" width="12" height="3" rx="0.5" fill="#f8fafc" />
          <rect x="6" y="-4" width="4" height="8" rx="1" fill="#94a3b8" />
          <circle cx="0" cy="0" r="2.5" fill="#0891b2" />
        </g>
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        সামনের হাঁটু ৯০° নামিয়ে সামনের হিলের শক্তিতে সোজা উঠুন
      </text>
    </svg>
  );
}

function ParallelBarDipsTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Parallel Bar Dips 2-step equipment guide"
    >
      <defs>
        <linearGradient id="pbdBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="pbdTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="pbdTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#pbdBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (SUSPENDED ARM LOCKOUT) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#047857" fillOpacity="0.25" stroke="#34d399" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#34d399" />
      <text x="48" y="33" fill="#a7f3d0" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="55" y="55" width="140" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#34d399" strokeWidth="0.8" />
      <text x="125" y="69" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="700" fontFamily="monospace">
        শূন্যে বডি লক • আর্ম সাপোর্ট
      </text>

      {/* Step 1 Parallel Dip Bars & Suspended Athlete */}
      <g transform="translate(20, 20)">
        {/* Parallel Dip Bars Station */}
        <line x1="75" y1="150" x2="75" y2="242" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
        <line x1="185" y1="150" x2="185" y2="242" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
        <line x1="60" y1="150" x2="200" y2="150" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />

        {/* Head */}
        <circle cx="130" cy="75" r="12" fill="#cbd5e1" />
        {/* Torso upright with slight forward lean */}
        <path d="M122 88 L138 88 L134 145 L118 145 Z" fill="url(#pbdTorso1)" />

        {/* Arms fully locked out holding parallel bar */}
        <line x1="124" y1="92" x2="115" y2="148" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
        <circle cx="115" cy="148" r="4" fill="#059669" />

        {/* Legs bent at knees suspended in air */}
        <path d="M125 145 L138 185 L125 210" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="125" cy="212" rx="6" ry="3.5" fill="#059669" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        প্যারালাল বারে হাত রেখে হাত সোজা করে শরীর শূন্যে ঝুলিয়ে তুলুন
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (90° ELBOW DESCENT) ================= */}
      <rect x="325" y="16" width="160" height="26" rx="13" fill="#059669" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#10b981" />
      <text x="348" y="33" fill="#6ee7b7" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: চেস্ট ডিপ
      </text>

      {/* Downward Dip Motion Arrow */}
      <path d="M410 115 L410 148" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="406,145 414,145 410,152" fill="#10b981" />

      {/* Cue badge */}
      <rect x="400" y="55" width="150" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#10b981" strokeWidth="0.8" />
      <text x="475" y="69" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700" fontFamily="monospace">
        ৯০° কনুই • চেস্ট ও ট্রাইসেপস
      </text>

      {/* Step 2 Parallel Dip Bars & Dipped Athlete */}
      <g transform="translate(320, 20)">
        {/* Parallel Dip Bars Station */}
        <line x1="75" y1="150" x2="75" y2="242" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
        <line x1="185" y1="150" x2="185" y2="242" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
        <line x1="60" y1="150" x2="200" y2="150" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />

        {/* Head lowered */}
        <circle cx="130" cy="115" r="12" fill="#f8fafc" />
        {/* Torso lowered & angled forward */}
        <path d="M120 128 L136 128 L130 185 L114 185 Z" fill="url(#pbdTorso2)" />

        {/* Arms bent at 90° angle */}
        <path d="M122 132 L102 148 L115 148" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="115" cy="148" r="4" fill="#047857" />

        {/* Legs bent in air */}
        <path d="M120 185 L135 220 L122 240" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="122" cy="242" rx="6" ry="3.5" fill="#047857" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        কনুই ৯০° কোণে নামিয়ে বুক ও ট্রাইসেপসের শক্তিতে ওপরে উঠুন
      </text>
    </svg>
  );
}

function BarbellHipThrustTwoStepGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      className="w-full h-full select-none"
      aria-label="Barbell Hip Thrust 2-step equipment guide"
    >
      <defs>
        <linearGradient id="bhtBg" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#080e1a" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="bhtTorso1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id="bhtTorso2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id="benchBht" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#475569" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#bhtBg)" />

      {/* Floor & Guideline */}
      <line x1="0" y1="262" x2="600" y2="262" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="0" y1="285" x2="600" y2="285" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Center Separation Divider */}
      <line x1="300" y1="35" x2="300" y2="265" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
      <g transform="translate(286, 136)">
        <circle cx="14" cy="14" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <path d="M10 14h8m-3-3l3 3-3 3" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ================= LEFT PANEL: STEP 1 (FLOOR START WITH BACK ON BENCH) ================= */}
      <rect x="25" y="16" width="145" height="26" rx="13" fill="#7e22ce" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1" />
      <circle cx="38" cy="29" r="4" fill="#c084fc" />
      <text x="48" y="33" fill="#e9d5ff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ১: শুরু
      </text>

      {/* Cue badge */}
      <rect x="65" y="55" width="140" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#c084fc" strokeWidth="0.8" />
      <text x="135" y="69" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="700" fontFamily="monospace">
        বেঞ্চে ব্যাক • হিপ ডিপ
      </text>

      {/* Step 1 Bench & Athlete on Floor with Barbell */}
      <g transform="translate(20, 20)">
        {/* Flat Bench */}
        <rect x="35" y="180" width="55" height="22" rx="3" fill="url(#benchBht)" stroke="#64748b" strokeWidth="1" />
        <line x1="45" y1="202" x2="45" y2="242" stroke="#475569" strokeWidth="5" />
        <line x1="80" y1="202" x2="80" y2="242" stroke="#475569" strokeWidth="5" />

        {/* Head & Upper Back on Bench Edge */}
        <circle cx="85" cy="170" r="11" fill="#cbd5e1" />
        {/* Torso angled downward from bench edge to floor hips */}
        <path d="M88 178 L135 220 L126 226 L80 184 Z" fill="url(#bhtTorso1)" />

        {/* Legs: hips on floor, knees bent up, feet flat on floor */}
        <path d="M130 220 L170 185 L180 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="184" cy="242" rx="8" ry="3.5" fill="#9333ea" />

        {/* Padded Barbell resting on hip crease */}
        <line x1="105" y1="210" x2="155" y2="210" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
        <circle cx="105" cy="210" r="15" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="155" cy="210" r="15" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="120" y="206" width="20" height="8" rx="2" fill="#a855f7" />
      </g>

      <text x="150" y="292" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
        বেঞ্চের কিনারে পিঠ রেখে হিপের ওপর প্যাডেড বারবেল বসান
      </text>

      {/* ================= RIGHT PANEL: STEP 2 (FULL HIP EXTENSION & PEAK GLUTE SQUEEZE) ================= */}
      <rect x="325" y="16" width="165" height="26" rx="13" fill="#9333ea" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1.2" />
      <circle cx="338" cy="29" r="4" fill="#c084fc" />
      <text x="348" y="33" fill="#f3e8ff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        পদক্ষেপ ২: হিপ থ্রাস্ট
      </text>

      {/* Upward Hip Thrust Arrow */}
      <path d="M465 210 L465 175" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      <polygon points="461,178 469,178 465,170" fill="#c084fc" />

      {/* Cue badge */}
      <rect x="390" y="55" width="155" height="20" rx="4" fill="#000" fillOpacity="0.85" stroke="#c084fc" strokeWidth="0.8" />
      <text x="467" y="69" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="700" fontFamily="monospace">
        টেবিলটপ হিপ্স • গ্লুট পিক স্কুইজ
      </text>

      {/* Step 2 Bench & Athlete at Peak Tabletop Extension */}
      <g transform="translate(320, 20)">
        {/* Flat Bench */}
        <rect x="35" y="180" width="55" height="22" rx="3" fill="url(#benchBht)" stroke="#64748b" strokeWidth="1" />
        <line x1="45" y1="202" x2="45" y2="242" stroke="#475569" strokeWidth="5" />
        <line x1="80" y1="202" x2="80" y2="242" stroke="#475569" strokeWidth="5" />

        {/* Head & Upper Back on Bench */}
        <circle cx="85" cy="170" r="11" fill="#f8fafc" />
        {/* Torso horizontal table-top at peak */}
        <rect x="90" y="174" width="60" height="15" rx="5" fill="url(#bhtTorso2)" />

        {/* Knees at 90°, vertical shins down to floor */}
        <path d="M150 180 L185 180 L185 240" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="188" cy="242" rx="8" ry="3.5" fill="#7e22ce" />

        {/* Padded Barbell raised at hip height */}
        <line x1="125" y1="170" x2="175" y2="170" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
        <circle cx="125" cy="170" r="15" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="175" cy="170" r="15" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="140" y="166" width="20" height="8" rx="2" fill="#c084fc" />
      </g>

      <text x="450" y="292" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        হিল দিয়ে মেঝে পুশ করে নিতম্ব তুলুন এবং গ্লুটস চরম সংকুচিত করুন
      </text>
    </svg>
  );
}

export default function WorkoutFlow() {
  const [step, setStep] = useState<"location" | "level" | "exercises" | "gym">("location");
  const [location, setLocation] = useState<WorkoutLocation>("home");
  const [level, setLevel] = useState<WorkoutLevel>("beginner");
  const [gymLevel, setGymLevel] = useState<GymWorkoutLevel>("basic");
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

  const handleSelectGymLevel = (lvl: GymWorkoutLevel) => {
    setGymLevel(lvl);
    setStep("exercises");
  };

  const activeLevelData = location === "gym" ? GYM_EXERCISES_DATA[gymLevel] : EXERCISES_DATA[level];

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
                    জাম্পিং জ্যাকস, এয়ার স্কোয়াট, ওয়াল/নি পুশ-আপ, গ্লুট ব্রিজ, বিগিনার প্ল্যাঙ্ক ও স্ট্রেচিং
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
                    হাই নিজ, ফুল পুশ-আপ, রিভার্স লাঞ্জেস, বাইসাইকেল ক্রাঞ্চ ও সিঙ্গেল-লেগ ব্রিজ
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
                    চেস্ট-টু-ফ্লোর বারপিস, ডায়মন্ড পুশ-আপ, জাম্প স্কোয়াট, হলো বডি হোল্ড, সাইড প্ল্যাঙ্ক ডিপস
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
                onClick={() => setStep(location === "gym" ? "gym" : "level")}
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
              >
                ← {location === "gym" ? "জিম মেনু" : "লেভেল পরিবর্তন"}
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
                    ) : ex.customGraphic === "standard-pushup" ? (
                      <PushUpTwoStepGraphic />
                    ) : ex.customGraphic === "reverse-lunge" ? (
                      <ReverseLungeTwoStepGraphic />
                    ) : ex.customGraphic === "chest-to-floor-burpees" ? (
                      <ChestToFloorBurpeesTwoStepGraphic />
                    ) : ex.customGraphic === "diamond-pushup" ? (
                      <DiamondPushUpTwoStepGraphic />
                    ) : ex.customGraphic === "jump-squats" ? (
                      <JumpSquatTwoStepGraphic />
                    ) : ex.customGraphic === "hollow-body-hold" ? (
                      <HollowBodyHoldTwoStepGraphic />
                    ) : ex.customGraphic === "side-plank-hip-dips" ? (
                      <SidePlankHipDipsTwoStepGraphic />
                    ) : ex.customGraphic === "knee-pushup" ? (
                      <KneePushUpTwoStepGraphic />
                    ) : ex.customGraphic === "gym-goblet-squat" ? (
                      <GobletSquatTwoStepGraphic />
                    ) : ex.customGraphic === "gym-bench-press" ? (
                      <DumbbellBenchPressTwoStepGraphic />
                    ) : ex.customGraphic === "gym-lat-pulldown" ? (
                      <LatPulldownTwoStepGraphic />
                    ) : ex.customGraphic === "gym-rdl" ? (
                      <DumbbellRDLTwoStepGraphic />
                    ) : ex.customGraphic === "gym-shoulder-press" ? (
                      <SeatedShoulderPressTwoStepGraphic />
                    ) : ex.customGraphic === "gym-barbell-squat" ? (
                      <BarbellBackSquatTwoStepGraphic />
                    ) : ex.customGraphic === "gym-barbell-bench-press" ? (
                      <BarbellBenchPressTwoStepGraphic />
                    ) : ex.customGraphic === "gym-bent-over-row" ? (
                      <BentOverRowTwoStepGraphic />
                    ) : ex.customGraphic === "gym-incline-dumbbell-press" ? (
                      <InclineDumbbellPressTwoStepGraphic />
                    ) : ex.customGraphic === "gym-leg-press" ? (
                      <LegPressMachineTwoStepGraphic />
                    ) : ex.customGraphic === "gym-barbell-deadlift" ? (
                      <ConventionalDeadliftTwoStepGraphic />
                    ) : ex.customGraphic === "gym-overhead-press" ? (
                      <OverheadMilitaryPressTwoStepGraphic />
                    ) : ex.customGraphic === "gym-bulgarian-split-squat" ? (
                      <BulgarianSplitSquatTwoStepGraphic />
                    ) : ex.customGraphic === "gym-parallel-dips" ? (
                      <ParallelBarDipsTwoStepGraphic />
                    ) : ex.customGraphic === "gym-hip-thrust" ? (
                      <BarbellHipThrustTwoStepGraphic />
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
                  <span>
                    {location === "gym" ? "সেট বিশ্রাম: ৬০-৯০ সেকেন্ড" : "সেট বিশ্রাম: ৩০-৬০ সেকেন্ড"}
                  </span>
                  <span className="text-[#ccff00]">
                    {location === "gym" ? "ইকুইপমেন্ট গাইড ✓" : "বডিওয়েট গাইড ✓"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Back Button */}
          <div className="pt-4 pb-8">
            <button
              type="button"
              onClick={() => setStep(location === "gym" ? "gym" : "level")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 shadow-md"
            >
              ← {location === "gym" ? "জিম মেনুতে ফিরে যান" : "অন্য লেভেল নির্বাচন করুন"}
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
            জিম ওয়ার্কআউট রুটিন
          </h2>
          <p className="text-xs text-slate-400 mb-6 text-center max-w-sm">
            ভারী সরঞ্জাম ও ডাম্বেল/মেশিনের সঠিক ফর্ম ও নিরাপত্তা নিশ্চিত করে শুরু করুন
          </p>

          {/* Gym Level Selection Routine Card */}
          <div className="flex flex-col gap-3 w-full mb-6">
            {/* Level 1: Gym Basic */}
            <button
              type="button"
              onClick={() => handleSelectGymLevel("basic")}
              className="p-4 rounded-2xl border border-blue-500/40 bg-blue-950/20 hover:border-blue-400 hover:bg-blue-900/30 transition-all text-left flex items-center justify-between group active:scale-[0.98] cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl shrink-0">
                  🏋️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                      ১. জিম বেসিক (Beginner Foundation)
                    </span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded">
                      ২৫-৩০ মিনিট
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    গবলেট স্কোয়াট, ডাম্বেল বেঞ্চ প্রেস, ল্যাট পুলডাউন, ডাম্বেল RDL, সিটেড শোল্ডার প্রেস
                  </p>
                </div>
              </div>
              <span className="text-blue-400 font-bold group-hover:translate-x-1 transition-transform ml-2">
                শুরু করুন &rarr;
              </span>
            </button>

            {/* Level 2: Gym Medium */}
            <button
              type="button"
              onClick={() => handleSelectGymLevel("intermediate")}
              className="p-4 rounded-2xl border border-amber-500/40 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-900/30 transition-all text-left flex items-center justify-between group active:scale-[0.98] cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                      ২. জিম মিডিয়াম (Intermediate Strength)
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded">
                      ৩৫-৪০ মিনিট
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    বারবেল ব্যাক স্কোয়াট, বারবেল বেঞ্চ প্রেস, বেন্ট-ওভার রো, ইনক্লাইন ডাম্বেল প্রেস, ৪৫° লেগ প্রেস
                  </p>
                </div>
              </div>
              <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform ml-2">
                শুরু করুন &rarr;
              </span>
            </button>

            {/* Level 3: Gym Hard */}
            <button
              type="button"
              onClick={() => handleSelectGymLevel("advanced")}
              className="p-4 rounded-2xl border border-red-500/40 bg-red-950/20 hover:border-red-400 hover:bg-red-900/30 transition-all text-left flex items-center justify-between group active:scale-[0.98] cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl shrink-0">
                  🔥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-red-400 transition-colors">
                      ৩. জিম হার্ড (Advanced Compound)
                    </span>
                    <span className="text-[10px] font-mono text-red-400 bg-red-500/15 px-2 py-0.5 rounded">
                      ৪০-৪৫ মিনিট
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    কনভেনশনাল ডেডলিফট, মিলিটারী প্রেস, বুলগেরিয়ান স্প্লিট স্কোয়াট, বার ডিপস, হিপ থ্রাস্ট
                  </p>
                </div>
              </div>
              <span className="text-red-400 font-bold group-hover:translate-x-1 transition-transform ml-2">
                শুরু করুন &rarr;
              </span>
            </button>
          </div>

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
