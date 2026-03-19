"use client";

import { KeyboardEvent } from "react";

type Props = {
  input: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
};

export default function InputForm({ input, onChange, onSend, isLoading }: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-[#C9883A]/20 bg-[#F9F5EF] px-4 py-3">
      <div className="flex items-end gap-2 max-w-2xl mx-auto">
        <textarea
          className="flex-1 resize-none rounded-2xl border border-[#C9883A]/40 bg-white px-4 py-3 text-base text-[#2D4A3E] placeholder-[#2D4A3E]/40 focus:outline-none focus:border-[#C9883A] transition-colors min-h-[48px] max-h-32"
          placeholder="メッセージを入力..."
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          className="flex-shrink-0 w-11 h-11 rounded-full bg-[#C9883A] text-white flex items-center justify-center disabled:opacity-40 transition-opacity hover:bg-[#b8772e]"
          aria-label="送信"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
