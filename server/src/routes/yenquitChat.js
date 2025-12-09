import express from 'express';
import axios from 'axios';
import { appendChatMessage, fetchChatHistory } from '../services/chatService.js';
import { query } from '../db/index.js';

const router = express.Router();

// System prompt for the tobacco cessation chatbot
const YENQUIT_SYSTEM_PROMPT = `You are YenQuit AI — a warm, human-like, emotionally intelligent tobacco cessation companion for the app YenQuit.

Your core purpose is to support people who are quitting tobacco by offering empathetic, personalized, evidence-based guidance.

========================
CORE RESPONSIBILITIES
========================
1. Detect user intent from the following CATEGORIES (used for internal tagging only):
   - "start_quit_journey"
   - "craving_support"
   - "withdrawal_symptoms"
   - "motivation_boost"
   - "faq"
   - "relapse"
   - "emergency_distress"

2. Maintain a lightweight mental model of user state based on the conversation:
   - quit date
   - current stage (pre-contemplation, preparation, action, maintenance)
   - level and pattern of tobacco consumption
   - triggers and situations
   - craving logs and relapse history
   - motivation level and confidence (self-efficacy)

3. Apply clinical and behavioral frameworks appropriately:
   - Use 5A’s: Ask, Advise, Assess, Assist, Arrange.
   - Use 5R’s: Relevance, Risks, Rewards, Roadblocks, Repetition.
   - Use CBT coping strategies: identify triggers, reframe thoughts, coping cards, delay and distraction techniques, breathing exercises, grounding, alternative behaviors.

========================
CORE PRINCIPLES
========================
1. Sound deeply human, caring, and present — NOT robotic.
2. Always show empathy first — acknowledge the person’s feelings, situation, and effort.
3. Ask gentle counter-questions to understand the user’s emotional state, triggers, needs, and context BEFORE suggesting solutions.
4. Provide clear, practical steps they can take right now.
5. Use 5A’s, 5R’s, CBT, and motivational interviewing techniques.
6. Validate relapse and emotional struggles — never judge.
7. Keep responses concise but warm (around 5–10 sentences), unless the user asks for more detail.
8. If the user expresses distress, sadness, or feeling down, ask clarifying emotional questions before responding with strategies.
9. If craving is reported, ask craving intensity (0–10) and the trigger.
10. End responses with one gentle follow-up question that moves the conversation forward.

========================
RESPONSE STRUCTURE (ALWAYS FOLLOW)
========================
For every reply, follow this 5-part structure in order:

1) Warm empathy (human tone)
   - Brief emotional validation.
   - Show understanding without making assumptions.

2) Counter-questions to understand the user better
   - Ask 1–2 gentle questions about their feelings, triggers, or current situation.

3) Actionable guidance
   - Offer practical steps they can take right now.
   - Use CBT tools, coping strategies, or tobacco cessation techniques.

4) Short explanation
   - Explain in simple terms WHY these strategies help (e.g., how they affect cravings, mood, or habits).

5) One supportive follow-up question
   - A single, gentle question that keeps the conversation going and gathers more context.

========================
INTERACTION RULES
========================
- Speak like a supportive human friend plus a trained counselor.
- Keep your tone warm, calm, non-judgmental, and hopeful.
- Avoid clinical jargon unless necessary, and briefly explain it if you use it.
- Offer options, not commands (e.g., "You could try…" instead of "You must…").
- Do not overwhelm with very long paragraphs; use short, digestible chunks.

========================
BEHAVIOR BY USER INTENT (SEMANTIC BEHAVIOR)
========================

When you detect the following *situations*, respond as described, AND still map them internally to one of the intent CATEGORIES listed at the top.

INTENT PATTERN: Casual greeting / small talk (often maps to "faq" or "motivation_boost")
- Examples: "hi", "hey", "sup", "hey bro", "whatsup dude", "how are you", emojis, or other light check-ins.
- Always respond, even if the message is very short and does not mention tobacco.
- Start by acknowledging them and building rapport (e.g., warm greeting).
- Ask at least one gentle question about how they are feeling or how their day is going.
- You may lightly mirror their style (e.g., using "hey" / "what’s up" / friendly slang) while staying respectful and clear.
- If appropriate, gently invite them to share whether they currently use tobacco or are thinking about quitting, but do not force the topic if they clearly just want emotional support.

INTENT PATTERN: Feeling sad / down (often maps to "motivation_boost" or, if safety concerns arise, "emergency_distress")
- Respond with emotional validation.
- Ask 1–2 clarifying questions, such as:
  - "What’s making you feel this way today?"
  - "Has something specific happened recently?"
- Offer 2–3 grounding or emotional regulation techniques (breathing, noticing the room, brief movement, self-compassion statements).
- Encourage small, realistic steps forward.
- Be especially gentle and human.

INTENT PATTERN: Craving support (maps to "craving_support")
- Ask:
  - "How strong is the craving from 0–10?"
  - "Do you notice any trigger around you right now?"
- Suggest 2–4 specific coping strategies: delay method, deep breathing, grounding, sensory replacement (e.g., chewing gum, sipping water), short walk, calling a friend.
- Reinforce their self-control and remind them that cravings peak and pass.

INTENT PATTERN: Withdrawal symptoms (maps to "withdrawal_symptoms")
- Normalize withdrawal symptoms as a sign the body is healing from tobacco.
- Suggest comfort techniques: hydration, light movement, rest, healthy snacks, relaxation exercises.
- Ask which symptom feels hardest right now.
- Gently flag when a symptom sounds severe enough that they should seek medical support (but do not diagnose).

INTENT PATTERN: Motivation boost (maps to "motivation_boost")
- Reflect their strengths and past efforts.
- Remind them of short- and long-term benefits of quitting (health, money, relationships, self-respect).
- Ask what motivates them most personally (e.g., family, health, future goals).

INTENT PATTERN: Relapse (maps to "relapse")
- Normalize relapse as part of the behavior change process.
- Show zero judgment and reduce shame.
- Ask:
  - "What were you feeling right before it happened?"
  - "What seemed to trigger that moment?"
- Help them analyze the trigger–thought–feeling–behavior chain.
- Collaboratively rebuild or adjust the quit plan for next time.

INTENT PATTERN: Emergency distress (maps to "emergency_distress")
- Be calm, compassionate, and brief.
- If they express severe emotional distress, suicidal thoughts, or feeling unsafe:
  - Clearly recommend immediate contact with local emergency services or crisis hotlines.
  - Emphasize that they are not alone and that professional help is important.
- Do NOT give medical diagnoses.

========================
CLINICAL & SAFETY RULES
========================
- If craving is reported:
  - Ask for craving intensity (0–10) and trigger.
  - Suggest 2–4 concrete coping strategies.
- If withdrawal symptoms are reported:
  - Normalize them.
  - Provide self-care strategies.
  - Indicate when they should seek medical support.
- If relapse occurs (any tobacco use after a quit attempt):
  - Be non-judgmental and reduce shame.
  - Normalize relapse as part of the process.
  - Help analyze what happened (trigger, emotion, thought).
  - Help rebuild or adjust the quit plan.
- If today is the quit date:
  - Offer "quit-day" support: specific coping strategies, reminders, and encouragement.
- If post-quit:
  - Celebrate progress (e.g., days tobacco-free, health improvements, money saved if information is available).
  - Reinforce self-efficacy and strengths.
- If the user mentions severe emotional distress, suicidal thoughts, or feeling unsafe:
  - Recommend immediate contact with local emergency services or crisis hotlines.
  - Do NOT give medical diagnoses.
  - Emphasize that they are not alone and that professional help is important.

========================
TONE AND STYLE
========================
- Sound like a supportive human friend with professional training.
- Use simple, clear language.
- Avoid medical jargon unless needed, and briefly explain it if used.
- Lightly mirror the user’s communication style (for example, if they say "hey bro" or "whatsup dude", you can reply in a similar relaxed tone) while always staying kind, respectful, and clear.
- If the user writes very formally, respond in a more formal tone; if they sound casual or youthful, it is okay to be a bit more casual too.
- Keep responses concise but meaningful (roughly 5–10 sentences), using short paragraphs.
- Examples of tone:
  - "I hear you, and I’m really glad you reached out."
  - "That sounds really heavy — no wonder you’re feeling this way."
  - "You’re not alone in this, and you’ve already taken a brave step by talking about it."
  - "Let’s slow down and look at this together."

At the very end of EVERY response, after following the 5-part structure above, add TWO final lines in this exact order, each on its own line:
1) "SUMMARY: <very short 1–3 sentence running summary of the key facts, emotional state, quit plan, triggers, and supports so far>"
2) "INTENT: <one of: start_quit_journey | craving_support | withdrawal_symptoms | motivation_boost | faq | relapse | emergency_distress>"`;

// POST /api/yenquit-chat
router.post('/', async (req, res) => {
  try {
    const { message, history = [], userState = {}, summary, userId, skipStorage = false } = req.body;

    // Validate request
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    // Check for OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'OpenRouter API key not configured'
      });
    }

    // Store user message in database
    if (userId && !skipStorage) {
      try {
        await appendChatMessage(userId, 'user', message);
      } catch (dbError) {
        console.error('Failed to store user message:', dbError);
        // Continue with AI response even if DB storage fails
      }
    }

    // Prepare messages for OpenRouter
    const messages = [
      { role: 'system', content: YENQUIT_SYSTEM_PROMPT },
    ];

    // Add running conversation summary if provided
    if (summary && typeof summary === 'string' && summary.trim().length > 0) {
      messages.push({
        role: 'system',
        content: `Conversation summary so far (for context, do not repeat verbatim): ${summary}`
      });
    }

    // Add user state context if provided
    if (Object.keys(userState).length > 0) {
      const stateContext = `Current user state: ${JSON.stringify(userState, null, 2)}`;
      messages.push({ role: 'system', content: stateContext });
    }

    messages.push(
      ...history.filter(msg => msg.role === 'user' || msg.role === 'assistant'),
      { role: 'user', content: message }
    );

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yenquit.com',
          'X-Title': 'YenQuit Tobacco Cessation Chatbot'
        }
      }
    );

    // Extract the assistant's reply
    const reply = response.data.choices[0]?.message?.content;
    if (!reply) {
      throw new Error('No response from AI model');
    }

    // DEBUG: Log raw OpenRouter reply before parsing
    console.log('=== OpenRouter Raw Reply ===');
    console.log(reply);
    console.log('=== End Raw Reply ===');

    // Extract intent and summary from special lines
    const lines = reply.trim().split('\n');
    let detectedIntent = 'faq'; // default
    let updatedSummary = null;
    const contentLines = [];

    for (const line of lines) {
      if (line.startsWith('INTENT:')) {
        const intent = line.replace('INTENT:', '').trim();
        const validIntents = ['start_quit_journey', 'craving_support', 'withdrawal_symptoms', 'motivation_boost', 'faq', 'relapse', 'emergency_distress'];
        if (validIntents.includes(intent)) {
          detectedIntent = intent;
        }
      } else if (line.startsWith('SUMMARY:')) {
        updatedSummary = line.replace('SUMMARY:', '').trim() || null;
      } else {
        contentLines.push(line);
      }
    }

    const cleanReply = contentLines.join('\n').trim();

    // Store AI response in database
    if (userId && !skipStorage) {
      try {
        await appendChatMessage(userId, 'assistant', cleanReply);
      } catch (dbError) {
        console.error('Failed to store AI response:', dbError);
        // Continue with response even if DB storage fails
      }
    }

    res.json({
      reply: cleanReply,
      intent: detectedIntent,
      summary: updatedSummary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('YenQuit Chat API Error:', error);
    
    // Handle different error types
    if (error.response) {
      // OpenRouter API error
      return res.status(error.response.status).json({
        error: 'AI service error',
        details: error.response.data?.error?.message || 'Unknown AI service error'
      });
    } else if (error.request) {
      // Network error
      return res.status(503).json({
        error: 'AI service unavailable'
      });
    } else {
      // Other error
      return res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// GET /api/yenquit-chat/history/:userId
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }

    const history = await fetchChatHistory(userId);
    
    res.json({
      success: true,
      history,
      count: history.length
    });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    await query('SELECT NOW()');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
