export const chatFallbackResponses = [
    "I hear you. Cancelling out the noise and focusing on your goal is key. You've got this.",
    "It's completely normal to feel this way. Take a deep breath and remember why you started.",
    "Every craving that passes is a victory. You're stronger than you think.",
    "Change is hard, but you are capable of amazing things. Keep going.",
    "I'm here to support you. What's one small thing you can do right now to feel better?",
    "You're doing great. Progress isn't always linear, but every step counts.",
    "That sounds tough. Have you tried the 5-minute rule? Wait 5 minutes and see if the urge passes.",
    "You're not alone in this journey. We're all rooting for you.",
    "Remember to be kind to yourself. You're unlearning a habit that's been there for a while.",
    "Take it one moment at a time. The urge will pass.",
    "Focus on how far you've come, not just how far you have to go.",
    "Allow yourself to feel uncomfortable without acting on it. It will pass."
];

export const insightFallbackResponses = [
    {
        title: "Routine Tip",
        messages: [
            "Start your day with a glass of water and deep breathing.",
            "Take a 5-minute walk after meals to reset your mind.",
            "Replace your smoking break with a healthy snack or tea.",
            "Set a small daily goal to keep yourself motivated.",
            "Practice mindfulness for a few minutes each morning."
        ]
    },
    {
        title: "Trigger Alert",
        messages: [
            "Notice your patterns and prepare for challenging moments.",
            "Stress is a common trigger; find healthy ways to unwind.",
            "Being around smokers can be tough; have an exit plan.",
            "Identify your emotional triggers and acknowledge them.",
            "Boredom often leads to cravings; keep your hands busy."
        ]
    },
    {
        title: "Progress Advice",
        messages: [
            "Every day without smoking is a victory worth celebrating.",
            "Your health is improving with every smoke-free hour.",
            "Reflect on the money you've saved since quitting.",
            "Small steps lead to big changes over time.",
            "Trust the process; your body is healing every day."
        ]
    }
];

export const adviseFallbackResponses = [
    "Quitting now is the best decision for your long-term health. Your body begins to repair itself within minutes of your last cigarette.",
    "You have the strength to overcome this addiction. Remember, every day smoke-free adds precious time to your life.",
    "It's never too late to stop. Your lungs can start to heal, and your risk of disease drops significantly over time.",
    "Focus on the benefits: more energy, better breathing, and freedom from addiction. You can do this.",
    "Breaking free from tobacco is a journey. Be patient with yourself and celebrate every small victory along the way.",
    "Your commitment to quitting is inspiring. Stay focused on your reasons for stopping, and you will succeed.",
    "Think of the example you are setting for those around you. Your journey to health is a powerful message.",
    "Withdrawal is temporary, but the benefits of quitting are permanent. Keep your eyes on the prize.",
    "You are reclaiming your health and your life. Trust in your ability to make this positive change.",
    "Every urge you resist makes you stronger. You are building a healthier, happier future for yourself."
];

export const getRandomChatFallback = () => {
    const index = Math.floor(Math.random() * chatFallbackResponses.length);
    return chatFallbackResponses[index];
};

export const getRandomInsights = () => {
    return insightFallbackResponses.map((category, index) => {
        const msgIndex = Math.floor(Math.random() * category.messages.length);
        return {
            id: index + 1,
            title: category.title,
            message: category.messages[msgIndex]
        };
    });
};

export const getRandomAdviseFallback = () => {
    const index = Math.floor(Math.random() * adviseFallbackResponses.length);
    return adviseFallbackResponses[index];
};
