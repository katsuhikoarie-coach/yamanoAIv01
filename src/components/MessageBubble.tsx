"use client";

type Props = {
  role: "user" | "model";
  text: string;
};

export default function MessageBubble({ role, text }: Props) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-3 animate-fade-in">
        <div className="max-w-[75%] bg-[#C9883A] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-3 animate-fade-in">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2D4A3E] flex items-center justify-center text-white text-xs font-serif">
        朝
      </div>
      <div className="max-w-[75%] bg-white text-[#2D4A3E] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}
