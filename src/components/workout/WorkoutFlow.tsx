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
    | "knee-pushup";
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
