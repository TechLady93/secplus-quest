# 🛡️ SecPlus Quest

**A gamified, voice-enabled study app for the CompTIA Security+ SY0-701 exam.**

**411 original practice questions** cover all 28 SY0-701 objectives, plus a Network Foundations warm-up bank. Every question comes with an explanation of *why* the right answer is right. You can read, listen, and play your way to passing Security+.

▶️ **Play it:** https://techlady93.github.io/secplus-quest/

---

## Features

| Mode | What it does |
|---|---|
| 🐉 **Boss Battle: Practice Exam** | 90 questions in 90 minutes, weighted like the real exam (12/22/18/28/20%). Flag questions and jump around, then get an estimated score on the 100–900 scale with a breakdown by domain. A quick 30-question version is also included. |
| 📚 **Practice by Domain / Objective** | Drill any domain or a single objective (1.1 through 5.6). You get instant feedback and a full explanation after every answer. |
| 🎯 **Weak Spots** | Spaced repetition (Leitner boxes). Questions you miss keep coming back until you master them, then return after 1, 2, 4, 7, and 15 days so they stick. |
| 🎧 **Audio Study (hands-free)** | Reads the question and choices, gives you thinking time, then reads the answer and the explanation. Good for driving, the gym, or chores. |
| ⚡ **Lightning Round** | 15 questions with 20 seconds each. Combos earn bonus XP. |
| 🃏 **Flashcards** | Flip to reveal the answer, then rate yourself. |
| 📊 **Stats** | Mastery by objective, exam history, and a "focus next" list. |

**Game layer:** XP, ranks (Recruit → Help Desk Hero → SOC Analyst → … → 👑 CISO), daily streaks, daily goals, and an exam-readiness meter.

**Every learning style:** 👀 visual progress and color-coded feedback · 👂 audio narration of questions *and* explanations · 📖 a written explanation for every answer · 🎮 hands-on gameplay with keyboard shortcuts (`1`–`4` to answer, `Enter` for next, `R` to read aloud).

## 🔊 Voice: built-in or ElevenLabs

- **Default:** your device's built-in voice. It's free and needs no setup.
- **ElevenLabs:** open ⚙️ Settings → Voice engine → *ElevenLabs*, paste your API key (elevenlabs.io → Profile → API Keys), tap **Load my ElevenLabs voices**, and pick a voice.
  - Your key is stored **only in your browser's localStorage** and is sent only to `api.elevenlabs.io`. It's never in this repo.
  - Generated audio is cached in your browser, so replaying a question doesn't use more credits.

## Run it locally

No build step and no dependencies. It's plain HTML, CSS, and JavaScript.

```bash
git clone https://github.com/TechLady93/secplus-quest.git
cd secplus-quest
python3 -m http.server 8000   # then open http://localhost:8000
```

(You can also just double-click `index.html`. ElevenLabs audio caching works best when the app is served over http or https.)

## Project structure

```
index.html          App shell
css/style.css       Navy / teal / gold theme, mobile-first
js/meta.js          Exam blueprint, objectives, ranks, question loader
js/tts.js           Voice engine (Web Speech + ElevenLabs with caching)
js/app.js           Game engine: modes, scoring, spaced repetition, progress
data/d1.js … d5.js  Security+ question banks by domain
data/net.js         Network Foundations warm-up bank
tools/validate.js   Question-bank checker (run: node tools/validate.js)
```

## Adding questions

Each data file calls `QB(objective, topic, rows)`. Each row is:

```js
["Question text?", ["Correct answer", "Wrong 1", "Wrong 2", "Wrong 3"], 0, "Explanation of why it's right (and why the others aren't)."]
```

The third value is the index of the correct choice. Choices are shuffled every time a question is shown, so it doesn't matter where you put the right answer. Run `node tools/validate.js` to check for duplicates, missing objectives, and formatting problems.

## Study tips

1. Work through each domain until mastery passes 80%, starting with **4.0 Security Operations** (28% of the exam).
2. Clear your 🎯 Weak Spots every day.
3. Take a 🐉 Boss Battle weekly. Book the real exam once you're consistently scoring **850+**. The score here is a straight-line estimate, and CompTIA's real scaling isn't public, so give yourself a cushion.
4. Use 🎧 Audio Study for review time away from your desk.
5. The real exam also includes performance-based questions (PBQs). Practice hands-on labs alongside this app.

---

*Questions are original and written to the public CompTIA SY0-701 exam objectives. SecPlus Quest is an independent study tool and is not affiliated with or endorsed by CompTIA. CompTIA and Security+ are trademarks of CompTIA, Inc.*

Built by [@TechLady93](https://github.com/TechLady93) · JoyfulChi.Tech
