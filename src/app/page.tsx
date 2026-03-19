"use client";
import { useState } from "react";
import { detectStep, UserState } from "@/lib/detectStep";
import ChatWindow from "@/components/ChatWindow";
import InputForm from "@/components/InputForm";

type Message = { role: "user" | "model"; text: string };

const INITIAL_MESSAGE: Message = {
  role: "model",
  text: "こんにちは！朝霧ヤマノのAIカウンセラーです。\n泥と琥珀で、あなたのお肌を整えるお手伝いをします。\nまず、お客様の年代を教えていただけますか？",
};

const INITIAL_STATE: UserState = { step: 1, age: "", budget: 0, concerns: [] };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);

  const handleReset = () => {
    if (window.confirm("カウンセリングを終了してよろしいですか？")) {
      setMessages([INITIAL_MESSAGE]);
      setInput("");
      setUserState(INITIAL_STATE);
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", text: input };
    const next = detectStep([...messages, userMsg], userState);
    setUserState(next);
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, userState: next }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let aiText = "";
      setMessages((prev) => [...prev, { role: "model", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "model", text: aiText };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "申し訳ありません。もう一度お試しください。" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-[#F9F5EF]">
      <header className="no-print py-4 px-6 border-b border-[#C9883A]/30 flex items-center justify-between">
        <div className="w-36" />
        <h1 className="text-[#2D4A3E] font-serif text-2xl tracking-widest">朝霧ヤマノ AIカウンセラー</h1>
        <div className="w-36 flex justify-end">
          <button
            onClick={handleReset}
            className="text-xs text-[#2D4A3E]/60 border border-[#2D4A3E]/20 rounded-full px-3 py-1.5 hover:bg-[#2D4A3E]/5 transition-colors whitespace-nowrap"
          >
            カウンセリングを終了する
          </button>
        </div>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <div className="no-print">
        <InputForm
          input={input}
          onChange={setInput}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
