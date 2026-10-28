---
name: ai-assistant-healer
description: >-
  Monitors the Iron & Habit AI assistant endpoint, inspects API status and multi-model fallbacks,
  and automatically heals, switches, or refreshes providers without breaking the UI.
---

# AI Assistant Healer & Self-Healing Guide for Iron & Habit

This skill provides operational procedures, diagnostic workflows, and automated healing commands to ensure the **Iron & Habit AI Assistant** runs 24/7 with zero downtime, zero UI breakage, and 100% scientifically verified responses naturally localized in Bengali.

---

## 1. Architecture Overview

The Iron & Habit AI Assistant utilizes a 3-tier resilient architecture:

```
[User Chat UI (Dashboard)]
           │
           ▼
[POST /api/assistant] ─── (or /api/assistant/chat)
           │
           ├─► [Tier 1: Cloud Gemini Models + Search Grounding]
           │     • Models: gemini-2.0-flash ➔ gemini-1.5-flash ➔ gemini-1.5-flash-8b ➔ gemini-2.0-flash-lite ➔ gemini-1.5-pro
           │     • Keys: GEMINI_API_KEY, BACKUP_GEMINI_API_KEY, GOOGLE_API_KEY (Auto-rotated)
           │     • Feature: Google Search grounding enabled for live, factual verification
           │
           ├─► [Tier 2: Local Scientific Knowledge & Research Engine]
           │     • Activated immediately on 429 Rate Limits, 503 Overloads, Quota Exceeded, or Missing Keys
           │     • 100% peer-reviewed exercise science, sports nutrition & habit psychology
           │     • Zero doubtful phrasing (no "হয়তো", "সম্ভবত", speculative advice)
           │
           └─► [Tier 3: Bengali Natural Localization & Telemetry Customization]
                 • Adapts responses to user's real-time BMI, weight, calories & water intake
                 • Naturally fluent, encouraging Bengali tone
```

---

## 2. Health Monitoring & Inspection

### A. Endpoint Health Check
Inspect the status and health report by querying the assistant endpoint:
```powershell
# Using PowerShell / curl
Invoke-RestMethod -Uri "http://localhost:3000/api/assistant" -Method Get
```
Expected response:
```json
{
  "status": "healthy", // or "local_fallback_active"
  "apiKeysFound": 1,
  "availableModels": ["gemini-2.0-flash", "gemini-1.5-flash", ...],
  "primaryProvider": "gemini-flash",
  "localKnowledgeReady": true,
  "recommendationBn": "সিস্টেম স্বাভাবিক রয়েছে। মাল্টি-মডেল এবং স্থানীয় ব্যাকআপ কার্যকর আছে।"
}
```

### B. Automated Diagnostic Script
Run the bundled diagnostic tool:
```bash
node scripts/heal-assistant.mjs --status
```
This inspects:
- `.env.local` API key definitions.
- Connectivity to Gemini REST API endpoints.
- Readiness of the Local Scientific Knowledge Engine.

---

## 3. Self-Healing Runbook

### Scenario 1: API Quota Exceeded or Rate Limit (HTTP 429 / 503)
**Symptoms:** Remote requests return 429 or 503.  
**Self-Healing Behavior:**
1. The orchestrator (`src/lib/assistant/orchestrator.ts`) automatically falls back down the candidate model chain (`gemini-2.0-flash` ➔ `gemini-1.5-flash` ➔ `gemini-1.5-flash-8b`).
2. If all models on the primary key are exhausted, it switches to `BACKUP_GEMINI_API_KEY`.
3. If all remote endpoints fail or exceed limits, it seamlessly engages the **Local Scientific Knowledge Engine**.
4. The user receives a high-quality Bengali response instantly. **The UI never breaks.**

### Scenario 2: Rotating or Updating API Keys
To refresh or replace an expired or exhausted API key:
```bash
# Using the healer script:
node scripts/heal-assistant.mjs --set-key "AIzaSy..."

# Or manually set in .env.local:
GEMINI_API_KEY=AIzaSy...
BACKUP_GEMINI_API_KEY=AIzaSyBackup...
```
The application picks up environment variables without requiring structural UI changes.

### Scenario 3: Missing API Key in Development
Even if no `GEMINI_API_KEY` is configured:
- The assistant operates in **Local Knowledge Mode**.
- Responds accurately to beginner questions, Bengali nutrition queries, 10-minute routines, fat loss science, and consistency habits.
- Guarantees 0 crash rate for all users.

---

## 4. Bengali Localization Guidelines

All assistant fallbacks and system responses must follow these standards:
- **Tone:** Empathetic, respectful, scientific, and motivating (বন্ধুত্বপূর্ণ ও অনুপ্রেরণাদায়ক).
- **Structure:** 
  1. মূল বার্তা / সারাংশ (Executive Summary)
  2. বৈজ্ঞানিক বাস্তবতা ও সত্য (Evidence-Based Facts)
  3. করণীয় কার্যকরী পদক্ষেপ (Actionable Steps)
  4. সহজ উপমা (Everyday Analogy)
- **Zero Hesitation Rule:** Never use hesitant or doubtful filler phrases (`হতে পারে`, `কিছু মানুষ বলে কিন্তু ঠিক না`, `maybe`, `perhaps`). State verified metabolic and biomechanical facts clearly.

---

## 5. Verification Checklist

Before deploying changes to the assistant routes:
- [ ] Run `npx tsc --noEmit` to verify type safety.
- [ ] Run `node scripts/heal-assistant.mjs --status` to verify diagnostic integrity.
- [ ] Send a test POST request to `/api/assistant` with `{ "message": "আমি একদম নতুন, কোথা থেকে শুরু করব?" }` and verify valid JSON with Bengali content.
