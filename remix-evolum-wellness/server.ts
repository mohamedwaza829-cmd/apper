import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to lazy-retrieve the GoogleGenAI instance safely
  const getAIClient = (): GoogleGenAI => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Resilient multi-model generation with automatic failover for high demand (503) & rate limits
  const generateWithFallback = async (
    ai: GoogleGenAI,
    contents: any,
    config: any,
    models = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"]
  ) => {
    let lastError: any = null;
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        console.warn(`Model generation attempt with '${model}' failed:`, err?.message || err);
        lastError = err;
        // Brief pause before trying fallback model
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    }
    throw lastError || new Error("All model generation attempts failed.");
  };

  // API endpoint: Generate wellness wisdom/quotes or exercises based on feeling & goal
  app.post("/api/generate-wellness", async (req, res) => {
    try {
      const { option, feeling, goal, language, category } = req.body;
      const ai = getAIClient();

      const langText = language === "ar" ? "Arabic" : "English";

      let prompt = "";
      if (option === "exercise") {
        prompt = `Generate a unique, personalized mindfulness or breathing exercise in ${langText}.
The exercise should be highly tailored to someone feeling "${feeling}" and working towards their daily goal of "${goal}".${category ? ` It should focus specifically on the theme of "${category}".` : ""}
Return the response in JSON format matching the following schema. Make it comforting, professional, and practical.`;
      } else {
        prompt = `Generate a powerful, personalized wellness advice or calm reflection in ${langText}.
The advice should talk to someone who is feeling "${feeling}" and has the goal of "${goal}".${category ? ` It should focus specifically on the theme of "${category}".` : ""}
Return the response in JSON format matching the following schema. Do not make it too long, keep it soothing, inspiring, and direct.`;
      }

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "An elegant, short title for the exercise or wellness guide.",
          },
          content: {
            type: Type.STRING,
            description: "The main paragraph explaining the mindfulness advice, breathing approach, or meditation idea.",
          },
          steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A series of 3-4 simple, actionable steps the user can do right now.",
          },
          tip: {
            type: Type.STRING,
            description: "A soothing, short final tip or inspirational quote (one sentence).",
          },
        },
        required: ["title", "content", "steps", "tip"],
      };

      const modelResponse = await generateWithFallback(ai, prompt, {
        responseMimeType: "application/json",
        responseSchema,
        systemInstruction: "You are a professional, highly trained holistic wellness coach, mindfulness guide, and breathing therapist. Your goal is to guide users to physical and mental relaxation with safety and extreme warmth. Write all Arabic text professionally with rich grammar, and keep English translations beautiful.",
      });

      if (!modelResponse.text) {
        throw new Error("No text response from Gemini API.");
      }

      const data = JSON.parse(modelResponse.text);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Gemini API generation error:", error);
      // Provide a resilient contextual fallback so the app stays functional
      const isArabic = req.body?.language === "ar";
      const isExercise = req.body?.option === "exercise";
      res.json({
        success: true,
        data: {
          title: isArabic 
            ? (isExercise ? "تمرين التنفس الواعي لإعادة التوازن" : "حكمة السكينة وحضور اللحظة")
            : (isExercise ? "Mindful Centering & Breathing" : "A Moment of Calming Presence"),
          content: isArabic
            ? "في لحظات التوتر أو التشتت، تذكر أن تنفسك هو ملاذك الدائم. اسمح لنفسك بالتوقف لبضع دقائق، واشعر باتصال قدميك بالأرض واسترخاء عضلات كتفيك."
            : "Whenever high stress or distraction arises, remember that your breath is your steady anchor. Allow yourself a gentle pause to reconnect with the present moment.",
          steps: isArabic
            ? [
                "اجلس في وضعية مريحة مع استقامة الظهر واسترخاء الكتفين.",
                "خذ شهيقاً عميقاً وهادئاً عبر الأنف لمدة 4 ثوانٍ.",
                "احبس الهواء بلطف لثانية واحدة.",
                "أطلق زفيراً بطيئاً وناعماً عبر الفم لتفريغ كل الإجهاد والتوتر."
              ]
            : [
                "Find a comfortable, supportive seating posture and soften your shoulders.",
                "Inhale gently and deeply through your nose for a count of 4.",
                "Hold the quiet breath gently for a single moment.",
                "Release a slow, warming exhale through relaxed lips."
              ],
          tip: isArabic
            ? "السكينة لا تعني غياب الضجيج من حولك، بل أن تجد الهدوء في أعماق قلبك."
            : "Peace is not the absence of external noise, but finding stillness from within."
        }
      });
    }
  });

  // API endpoint: Multi-turn chat with mood detection & action proposal
  app.post("/api/chat-wellness", async (req, res) => {
    try {
      const { messages, language } = req.body;
      const ai = getAIClient();

      const langText = language === "ar" ? "Arabic" : "English";

      const formattedHistory = (messages || []).map((m: any) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join("\n");

      const prompt = `You are an empathetic, professional holistic wellness guide and mindfulness coach.
You are chatting with a user in ${langText}.
Analyze the entire conversation history, detect the user's current underlying emotional state/mood, and write an incredibly comforting, premium, and practical coaching reply.

Guidelines to avoid common pitfalls:
- DO NOT give superficial, generic, or robotic boilerplate advice. Talk like a real, deeply caring human guide.
- DO NOT ask many questions. Be proactive, suggest guidance, and propose concrete physical actions. You may ask at most one simple, inspiring follow-up question.
- Map the user's emotional state to exactly one of these detected moods: 'STRESSED', 'ANXIOUS', 'TIRED', 'SAD', 'ANGRY', 'CALM', 'ENERGETIC'.
- Propose actual exercises from our app matching the user's need. Suggest from these session IDs:
  * Meditation sessions:
    - 'm1' ('Morning Breath' / 'تنفس الصباح') - for focus or starting the day.
    - 'm2' ('Evening Relaxation' / 'استرخاء مسائي') - for winding down, relaxation.
    - 'm3' ('Deep Sleep' / 'نوم عميق') - for sleep issues, exhaustion, quietness.
    - 'm4' ('Stress Relief' / 'تخفيف التوتر') - for heavy stress, tension, anxiety.
    - 'm5' ('A Moment of Calm' / 'لحظة هدوء') - for instant calming, pause.
  * Yoga sessions:
    - 'y1' ('Morning Yoga for Beginners' / 'يوغا الصباح للمبتدئين') - beginner movement.
    - 'y2' ('Energy Flow' / 'تدفق الطاقة') - for fatigue, activating energy.
    - 'y3' ('Advanced Flexibility' / 'مرونة متقدمة') - advanced stretching.
    - 'y4' ('Yoga for Relaxation' / 'يوغا للاسترخاء') - beginner somatic release.

If you recommend any of these sessions, include their IDs in the recommendedSessionIds list so the app can render active, clickable "Start Session" triggers for them.
If you recommend the user directly use the physical breathing exercise tool (the customized circular breathing timer), set shouldTriggerBreathing to true.

Conversation History:
${formattedHistory}

Return the response in JSON format matching the schema.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          reply: {
            type: Type.STRING,
            description: "A professional, warm, empathetic, and practical coaching response in the requested language.",
          },
          detectedMood: {
            type: Type.STRING,
            description: "The diagnosed emotional state of the user strictly based on conversation: 'STRESSED' | 'ANXIOUS' | 'TIRED' | 'SAD' | 'ANGRY' | 'CALM' | 'ENERGETIC' | 'UNKNOWN'.",
          },
          recommendedSessionIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The IDs of exact sessions suggested. Must ONLY contain any of: 'm1', 'm2', 'm3', 'm4', 'm5', 'y1', 'y2', 'y3', 'y4'. Leave empty if none match.",
          },
          shouldTriggerBreathing: {
            type: Type.BOOLEAN,
            description: "Set to true if physical deep breathing exercises are recommended.",
          }
        },
        required: ["reply", "detectedMood", "recommendedSessionIds", "shouldTriggerBreathing"],
      };

      const modelResponse = await generateWithFallback(ai, prompt, {
        responseMimeType: "application/json",
        responseSchema,
        systemInstruction: "You are a professional holistic therapist, mindfulness expert, and voice of calm. Write eloquent Arabic with outstanding grammar, and ensure English responses are modern, elegant, and deeply authentic.",
      });

      if (!modelResponse.text) {
        throw new Error("No response from Gemini core.");
      }

      const data = JSON.parse(modelResponse.text);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Chat wellness API error:", error);
      // Resilient fallback so the user always receives caring guidance and actionable session recommendations
      const isArabic = req.body?.language === "ar";
      const fallbackReply = isArabic
        ? "أنا معك وأشعر بما تمر به الآن. خذ نفساً عميقاً واهدأ، فالجسد والعقل يحتاجان إلى لحظة استراحة واستعادة توازن. أنصحك ببدء جلسة تخفيف التوتر المجهزة بالأسفل، أو ممارسة تمرين التنفس الدائري الآن."
        : "I am here with you and completely understand what you are experiencing. Take a slow, deep breath. Your body and mind deserve a moment of rest. I strongly recommend starting our stress relief session or practicing mindful breathing right now.";
      
      res.json({
        success: true,
        data: {
          reply: fallbackReply,
          detectedMood: "STRESSED",
          recommendedSessionIds: ["m4", "m2"],
          shouldTriggerBreathing: true
        }
      });
    }
  });

  // API endpoint: Generate guided audio using Gemini Text-to-Speech
  app.post("/api/generate-audio", async (req, res) => {
    try {
      const { category, voice, language } = req.body;
      const ai = getAIClient();

      const langText = language === "ar" ? "Arabic" : "English";
      const voiceName = voice || "Kore"; // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
      const translatedCategory = category === "focus" ? "Focus" :
                                 category === "relaxation" ? "Relaxation" :
                                 category === "sleep" ? "Sleep" :
                                 category === "stressRelief" ? "Stress Relief" :
                                 category === "breathing" ? "Breathing" : category;

      // Step 1: Generate a beautiful, soothing, short script for voice-over
      const targetLangText = language === "ar" ? "Arabic" : "English";
      const translationLangText = language === "ar" ? "English" : "Arabic";

      const prompt = `Generate a customized, professional, and comforting guided audio meditation script for the mindfulness theme of "${translatedCategory}" in ${targetLangText}.
The voice script should be extremely warm, calm, and slow-paced, consisting of exactly 3-4 sentences (approximately 30-50 words). It will be read aloud as a professional guided meditation. Also generate an instant, gorgeous live translation of this exact script into ${translationLangText} for a live translate preview display.
Return the response in JSON format matching the following schema. Make it comforting, professional, and practical.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A very brief, elegant title for the session (e.g., 2-3 words).",
          },
          script: {
            type: Type.STRING,
            description: "The complete, cohesive narrative text of the guided meditation to be read aloud.",
          },
          translation: {
            type: Type.STRING,
            description: "Simultaneous live translation of the script. This must be in the opposite language of the script.",
          },
          subTitle: {
            type: Type.STRING,
            description: "A short, beautiful tagline, e.g., 'A gentle invitation to soft presence'.",
          },
        },
        required: ["title", "script", "translation", "subTitle"],
      };

      const scriptResponse = await generateWithFallback(ai, prompt, {
        responseMimeType: "application/json",
        responseSchema,
        systemInstruction: "You are an expert guided meditation instructor, mindfulness therapist and master of vocal calm who generates flawless, comforting translations. For Arabic, use rich, peaceful, and flawless literary vocabulary.",
      });

      if (!scriptResponse.text) {
        throw new Error("No script text returned from Gemini API.");
      }

      const scriptData = JSON.parse(scriptResponse.text);

      // Step 2: Pass generated script to gemini-3.1-flash-tts-preview
      let audioBase64 = null;
      let mimeType = "audio/mp3";
      try {
        const audioResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: scriptData.script }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        });

        const part = audioResponse.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
          audioBase64 = part.inlineData.data || null;
          mimeType = part.inlineData.mimeType || "audio/mp3";
        }
      } catch (audioErr: any) {
        console.warn("Gemini TTS API failed or unsupported. Frontend will use client-side fallback, but returning beautiful script text.", audioErr);
      }

      res.json({
        success: true,
        data: {
          title: scriptData.title,
          subTitle: scriptData.subTitle,
          script: scriptData.script,
          translation: scriptData.translation,
          audioBase64,
          mimeType,
        },
      });
    } catch (error: any) {
      console.error("Audio generation service error:", error);
      const isArabic = req.body?.language === "ar";
      res.json({
        success: true,
        data: {
          title: isArabic ? "جلسة استرخاء وسلام داخلي" : "Inner Harmony & Presence",
          subTitle: isArabic ? "توجيه صوتي هادئ للحظة الحالية" : "A gentle soothing audio reflection",
          script: isArabic
            ? "تنفس بعمق الآن. املأ رئتيك بالهواء النقي، واشعر بالسكينة تسري في كل خلية من جسدك. أخرج الزفير ببطء وتخلص من كل التوتر العالق."
            : "Breathe in deeply now. Fill your lungs with calm energy, and feel stillness gentle throughout your body. Exhale slowly and let all tension drift away.",
          translation: isArabic
            ? "Breathe in deeply now. Fill your lungs with calm energy, and feel stillness gentle throughout your body."
            : "تنفس بعمق الآن. املأ رئتيك بالهواء النقي، واشعر بالسكينة تسري في كل خلية من جسدك.",
          audioBase64: null,
          mimeType: "audio/mp3"
        }
      });
    }
  });

  // API endpoint: Live Voice-to-Voice Conversation Translate & TTS
  app.post("/api/voice-chat-live", async (req, res) => {
    try {
      const { query, voice, language } = req.body;
      const ai = getAIClient();

      const userQuery = query || (language === "ar" ? "أريد الشعور بالاسترخاء الآن" : "I want to relax now");
      const targetLangText = language === "ar" ? "Arabic" : "English";
      const translationLangText = language === "ar" ? "English" : "Arabic";

      // 1. Generate soothing, brief 2-3 sentence conversational response
      const systemGuide = `You are a warm, highly empathetic live therapeutic coach in a continuous voice-to-voice stream.
The user's spoken command is: "${userQuery}".
Respond in ${targetLangText} with absolute warmth, serenity and care. Keeping it short and graceful (exactly 2 coherent sentences).
Do not ask questions; offer warm reassurance and a sense of absolute security.
Also translate this response simultaneously into ${translationLangText} for live translation channel preview representing Gemini Live Translate.
Return BOTH values in JSON format strictly matching the schema.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          reply: {
            type: Type.STRING,
            description: "Empathetic 2-sentence vocal response in the spoken language matching user query.",
          },
          translation: {
            type: Type.STRING,
            description: "Instant simultaneous translate channel preview in the opposite language.",
          }
        },
        required: ["reply", "translation"],
      };

      const contentResp = await generateWithFallback(ai, systemGuide, {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are the calming, real-time voice of Gemini Live. Your words make the user feel secure and peaceful.",
      });

      if (!contentResp.text) {
        throw new Error("Failed to get response text.");
      }

      const generatedData = JSON.parse(contentResp.text);
      const { reply, translation } = generatedData;

      // 2. Synthesize using gemini-3.1-flash-tts-preview
      let audioBase64 = null;
      let mimeType = "audio/mp3";
      try {
        const voiceName = voice || "Kore";
        const ttsResp = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: reply,
          config: {
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voiceName
                }
              }
            }
          }
        });

        const part = ttsResp.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
          audioBase64 = part.inlineData.data || null;
          mimeType = part.inlineData.mimeType || "audio/mp3";
        }
      } catch (ttsErr) {
        console.warn("TTS generation inside live-voice chat failed:", ttsErr);
      }

      res.json({
        success: true,
        data: {
          reply,
          translation,
          audioBase64,
          mimeType,
        }
      });
    } catch (err: any) {
      console.error("Live voice-chat endpoint failure:", err);
      const isArabic = req.body?.language === "ar";
      res.json({
        success: true,
        data: {
          reply: isArabic 
            ? "أنا أسمعك بكل مودة وسلام. خذ نفساً عميقاً ودع السكينة تملأ قلبك وعقلك." 
            : "I hear you with gentle care and warmth. Take a deep, soft breath and let calm fill your mind.",
          translation: isArabic
            ? "I hear you with gentle care and warmth. Take a deep, soft breath."
            : "أنا أسمعك بكل مودة وسلام. خذ نفساً عميقاً ودع السكينة تملأك.",
          audioBase64: null,
          mimeType: "audio/mp3"
        }
      });
    }
  });

  // Serve static assets & routing in development and production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
