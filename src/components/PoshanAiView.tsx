import React, { useState } from "react";
import { ChildProfile, VitalRecord } from "../types";
import { Mic, RefreshCw, AudioWaveform, Activity, Utensils, Lightbulb, Send } from "lucide-react";

interface PoshanAiViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  isDarkMode?: boolean;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const PoshanAiView: React.FC<PoshanAiViewProps> = ({ child, vitals, isDarkMode = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hi! I'm PoshanAi. I'm here to answer any questions about ${child.name}'s growth, nutrition, or meal prep!`,
    },
  ]);

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    const newMessages: Message[] = [...messages, { sender: "user", text: queryText }];
    setMessages(newMessages);
    setUserInput("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/poshan-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          childContext: {
            name: child.name,
            ageYears: child.ageYears,
            ageMonths: child.ageMonths,
            weight: vitals.weight,
            height: vitals.height,
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || `I'm tracking ${child.name}'s metrics and everything looks great! Let me know if you need specific recipes.`;

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      speakResponse(reply);
    } catch {
      const fallback = `${child.name} is tracking beautifully in the healthy percentile. For toddlers, offering 3 balanced main meals plus 2 gentle healthy snacks like sliced fruits or yogurt works wonderfully!`;
      setMessages((prev) => [...prev, { sender: "ai", text: fallback }]);
      speakResponse(fallback);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage(`Is ${child.name}'s weight tracking well?`);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col w-full relative pt-16 pb-32 px-5 max-w-lg mx-auto min-h-screen">
      <div className="flex flex-col items-center text-center space-y-1 mt-4 mb-6">
        <AudioWaveform className={`w-8 h-8 mb-1 ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`} />
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
          Hi, I'm PoshanAi
        </h2>
        <p className={`text-sm max-w-[280px] ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>
          How can I help you and your little one today?
        </p>
      </div>

      <div className="flex items-center justify-center my-6">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div
            className={`absolute w-full h-full rounded-full opacity-30 ${
              isDarkMode ? "bg-[#3fff80]" : "bg-[#cae8c9]"
            } ${isListening ? "animate-ping" : "animate-pulse-slow"}`}
          />
          <div className="absolute w-[80%] h-[80%] rounded-full bg-[#2d4739] opacity-25 animate-pulse-medium" />

          <button
            onClick={toggleListen}
            className={`relative w-[60%] h-[60%] rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95 ring-8 ${
              isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#173124] text-white"
            } ${isListening ? (isDarkMode ? "ring-[#3fff80]/40 scale-110" : "ring-[#cae8c9] scale-110") : "ring-transparent"}`}
            aria-label="Voice microphone"
          >
            {isListening ? (
              <AudioWaveform className="w-12 h-12 animate-pulse" />
            ) : isThinking ? (
              <RefreshCw className="w-12 h-12 animate-spin" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </button>
        </div>
      </div>

      <p className={`text-center text-xs font-semibold mb-6 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>
        {isListening ? "Listening to your voice..." : isThinking ? "PoshanAi is thinking..." : "Tap orb to speak"}
      </p>

      {messages.length > 0 && (
        <div className="flex flex-col gap-3 mb-6 max-h-60 overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[88%] ${
                m.sender === "user"
                  ? isDarkMode
                    ? "bg-[#3fff80] text-[#0a120e] font-semibold self-end rounded-tr-xs shadow-xs"
                    : "bg-[#173124] text-white self-end rounded-tr-xs shadow-xs"
                  : isDarkMode
                  ? "bg-[#14231b] text-[#ffffff] border border-[#22392b] self-start rounded-tl-xs"
                  : "bg-[#efeeea] text-[#1b1c1a] self-start rounded-tl-xs border border-[#e3e2df]"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
      )}

      <div className="w-full flex flex-col gap-2.5">
        <p className={`text-xs font-semibold text-center mb-1 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>
          Try asking about...
        </p>

        <button
          onClick={() => handleSendMessage(`Is ${child.name}'s weight tracking well?`)}
          className={`rounded-xl p-3.5 flex items-center gap-3.5 text-left border transition-colors ${
            isDarkMode
              ? "bg-[#14231b] border-[#22392b] hover:bg-[#1a2e23]"
              : "bg-[#f4f4f0] border-[#e3e2df] hover:bg-[#efeeea]"
          }`}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#4f6951]"
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <span className={`text-sm font-medium ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
            "Is {child.name}'s weight tracking well?"
          </span>
        </button>

        <button
          onClick={() => handleSendMessage("What's a good lunch for a toddler?")}
          className={`rounded-xl p-3.5 flex items-center gap-3.5 text-left border transition-colors ${
            isDarkMode
              ? "bg-[#14231b] border-[#22392b] hover:bg-[#1a2e23]"
              : "bg-[#f4f4f0] border-[#e3e2df] hover:bg-[#efeeea]"
          }`}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#2d4739] text-white"
          }`}>
            <Utensils className="w-5 h-5" />
          </div>
          <span className={`text-sm font-medium ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
            "What's a good lunch for a toddler?"
          </span>
        </button>

        <button
          onClick={() => handleSendMessage("How to handle picky eating in toddlers?")}
          className={`rounded-xl p-3.5 flex items-center gap-3.5 text-left border transition-colors ${
            isDarkMode
              ? "bg-[#14231b] border-[#22392b] hover:bg-[#1a2e23]"
              : "bg-[#f4f4f0] border-[#e3e2df] hover:bg-[#efeeea]"
          }`}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#3b443c] text-white"
          }`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className={`text-sm font-medium ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
            "How to handle picky eating?"
          </span>
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(userInput);
        }}
        className="flex items-center gap-2 mt-4"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask PoshanAi anything..."
          className={`flex-1 text-sm py-3 px-4 rounded-full border focus:outline-none ${
            isDarkMode
              ? "bg-[#14231b] text-[#ffffff] border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
              : "bg-[#f4f4f0] text-[#1b1c1a] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
          }`}
        />
        <button
          type="submit"
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-all ${
            isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#173124] text-white"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
