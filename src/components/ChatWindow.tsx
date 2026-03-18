"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

type Message = { role: "user" | "model"; text: string };

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export default function ChatWindow({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} text={msg.text} />
      ))}
      {isLoading && (
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2D4A3E] flex items-center justify-center text-white text-xs font-serif">
            朝
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <span className="inline-flex gap-1">
              <span className="w-2 h-2 bg-[#C9883A] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[#C9883A] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-[#C9883A] rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
