import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

export function AIHelperChat() {
  const [message, setMessage] = useState("");

  const chatHistory = [
    { id: 1, type: "ai", message: "Hello! I'm here to support you on your journey. How are you feeling today?", time: "10:00 AM" },
    { id: 2, type: "user", message: "I'm feeling a bit stressed today and having some cravings.", time: "10:02 AM" },
    { id: 3, type: "ai", message: "I understand that stress can trigger cravings. Let's work through this together. Have you tried the 5-minute breathing exercise we discussed? It can help calm your mind and reduce the intensity of cravings.", time: "10:02 AM" },
    { id: 4, type: "user", message: "Not yet, I'll try it now.", time: "10:05 AM" },
    { id: 5, type: "ai", message: "Great! Remember, you're on day 12 and doing wonderfully. Each craving you overcome makes you stronger. I'm here if you need more support.", time: "10:05 AM" },
  ];

  const suggestionChips = [
    "Help with cravings",
    "Motivation for today",
    "Stress management tips",
    "Track my progress",
  ];

  const handleChipClick = (chip: string) => {
    setMessage(chip);
  };

  return (
    <Card className="rounded-3xl shadow-lg border-0 h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl" style={{ backgroundColor: "#20B2AA20" }}>
            <Sparkles className="w-6 h-6" style={{ color: "#20B2AA" }} />
          </div>
          <div>
            <h3 className="text-lg" style={{ color: "#1C3B5E" }}>Your Personal AI Helper</h3>
            <p className="text-xs" style={{ color: "#333333", opacity: 0.6 }}>Always here to support you</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {chatHistory.map((chat) => (
          <div key={chat.id} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${chat.type === "ai" ? "order-1" : "order-2"}`}>
              <div
                className={`p-4 rounded-2xl ${chat.type === "ai" ? "rounded-tl-sm" : "rounded-tr-sm"}`}
                style={{ backgroundColor: chat.type === "ai" ? "#20B2AA10" : "#f5f5f5", borderLeft: chat.type === "ai" ? "3px solid #20B2AA" : "none" }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "#333333" }}>{chat.message}</p>
              </div>
              <p className={`text-xs mt-1 ${chat.type === "user" ? "text-right" : "text-left"}`} style={{ color: "#333333", opacity: 0.5 }}>
                {chat.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {suggestionChips.map((chip, index) => (
            <button key={index} onClick={() => handleChipClick(chip)} className="px-4 py-2 rounded-2xl text-xs transition-all hover:opacity-80" style={{ backgroundColor: "#20B2AA10", color: "#20B2AA" }}>
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100">
        <div className="flex gap-3">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 rounded-2xl border-gray-200 focus:border-transparent focus:ring-2" />
          <Button className="rounded-2xl px-6 transition-all hover:opacity-90" style={{ backgroundColor: "#20B2AA" }}>
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
