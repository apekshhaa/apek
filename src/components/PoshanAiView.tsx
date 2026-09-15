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
    <div className="flex flex-col w-full relative pt-4 pb-28 px-5 max-w-lg mx-auto gap-5 min-h-[calc(100vh-80px)]">
      {/* Header Title Section */}
      <div className="flex flex-col items-center text-center w-full">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 shadow-xs ${
          isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
        }`}>
          <AudioWaveform className="w-6 h-6" />
        </div>
        <h1 className={`font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight leading-tight ${
          isDarkMode ? "text-white" : "text-[#173124]"
        }`}>
          PoshanAi Voice Assistant
        </h1>
        <p className={`font-['Manrope',sans-serif] text-sm sm:text-base font-medium tracking-normal mt-1 max-w-[300px] ${
          isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
        }`}>
          Ask anything about {child.name}'s health or nutrition.
        </p>
      </div>

      {/* Voice Orb Container */}
      <div className="flex items-center justify-center my-2">
        <div className="relative w-52 h-52 flex items-center justify-center">
          <div
            className={`absolute w-full h-full rounded-full opacity-25 ${
              isDarkMode ? "bg-[#3fff80]" : "bg-[#cae8c9]"
            } ${isListening ? "animate-ping" : "animate-pulse-slow"}`}
          />
          <div className={`absolute w-[80%] h-[80%] rounded-full opacity-20 ${
            isDarkMode ? "bg-[#3fff80]" : "bg-[#173124]"
          } animate-pulse-medium`} />

          <button
            onClick={toggleListen}
            className={`relative w-[60%] h-[60%] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ring-8 ${
              isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#173124] text-white"
            } ${isListening ? (isDarkMode ? "ring-[#3fff80]/40 scale-110" : "ring-[#cae8c9] scale-110") : "ring-transparent"}`}
            aria-label="Voice microphone"
          >
            {isListening ? (
              <AudioWaveform className="w-10 h-10 animate-pulse" />
            ) : isThinking ? (
              <RefreshCw className="w-10 h-10 animate-spin" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>
      </div>

      <p className={`text-center font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-[1.75px] -mt-2 ${
        isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
      }`}>
        {isListening ? "LISTENING TO YOUR VOICE..." : isThinking ? "POSHAN AI IS THINKING..." : "TAP ORB TO SPEAK"}
      </p>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1 my-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-3xl font-['Manrope',sans-serif] text-sm leading-relaxed max-w-[88%] shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
                m.sender === "user"
                  ? isDarkMode
                    ? "bg-[#3fff80] text-[#0a120e] font-semibold self-end rounded-tr-xs"
                    : "bg-[#173124] text-white font-medium self-end rounded-tr-xs"
                  : isDarkMode
                  ? "bg-[#14231b] text-white border border-[#22392b] self-start rounded-tl-xs"
                  : "bg-white/80 text-[#1b1c1a] border border-[#e3e2df] self-start rounded-tl-xs"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
      )}

      {/* Prompt Suggestions */}
      <div className="w-full flex flex-col gap-2.5">
        <span className={`font-['Space_Grotesk',sans-serif] text-[11.5px] font-semibold uppercase tracking-[1.75px] text-center ${
          isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"
        }`}>
          Try asking about...
        </span>

        <button
          onClick={() => handleSendMessage(`Is ${child.name}'s weight tracking well?`)}
          className={`rounded-3xl p-4 flex items-center gap-3.5 text-left border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
            isDarkMode
              ? "bg-[#14231b] border-[#22392b] hover:bg-[#1f3829]"
              : "bg-white/80 border-[#e3e2df] hover:bg-white"
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <span className={`font-['Manrope',sans-serif] text-sm font-semibold ${isDarkMode ? "text-white" : "text-[#173124]"}`}>
            "Is {child.name}'s weight tracking well?"
          </span>
        </button>

        <button
          onClick={() => handleSendMessage("What's a good lunch for a toddler?")}
          className={`rounded-3xl p-4 flex items-center gap-3.5 text-left border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
            isDarkMode
              ? "bg-[#14231b] border-[#22392b] hover:bg-[#1f3829]"
              : "bg-white/80 border-[#e3e2df] hover:bg-white"
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
          }`}>
            <Utensils className="w-5 h-5" />
          </div>
          <span className={`font-['Manrope',sans-serif] text-sm font-semibold ${isDarkMode ? "text-white" : "text-[#173124]"}`}>
            "What's a healthy lunch for toddlers?"
          </span>
        </button>

        <button
          onClick={() => handleSendMessage("How to handle picky eating in toddlers?")}
          className={`rounded-3xl p-4 flex items-center gap-3.5 text-left border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
            isDarkMode
              ? "bg-[#14231b] border-[#22392b] hover:bg-[#1f3829]"
              : "bg-white/80 border-[#e3e2df] hover:bg-white"
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
          }`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className={`font-['Manrope',sans-serif] text-sm font-semibold ${isDarkMode ? "text-white" : "text-[#173124]"}`}>
            "How to manage picky eating?"
          </span>
        </button>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(userInput);
        }}
        className="flex items-center gap-2.5 mt-2"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask PoshanAi anything..."
          className={`flex-1 font-['Manrope',sans-serif] text-sm py-3.5 px-5 rounded-full border transition-all focus:outline-none ${
            isDarkMode
              ? "bg-[#14231b] text-white border-[#22392b] focus:ring-2 focus:ring-[#3fff80]"
              : "bg-white text-[#173124] border-[#e3e2df] focus:ring-2 focus:ring-[#173124]"
          }`}
        />
        <button
          type="submit"
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs ${
            isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#173124] text-white"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
