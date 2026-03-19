"use client";

type Props = {
  role: "user" | "model";
  text: string;
};

export default function MessageBubble({ role, text }: Props) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-3 animate-fade-in">
        <div className="max-w-[75%] bg-[#C9883A] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-base leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  }

  // AIの商品提案メッセージ（「おすすめ」を含む）には印刷ボタンを表示
  const isRecommendation = text.includes("おすすめ");

  return (
    <div className="flex flex-col mb-3 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2D4A3E] flex items-center justify-center text-white text-sm font-serif">
          朝
        </div>
        <div className="max-w-[75%] bg-white text-[#2D4A3E] rounded-2xl rounded-tl-sm px-4 py-3 text-base leading-relaxed shadow-sm whitespace-pre-wrap">
          {text}
        </div>
      </div>
      {isRecommendation && (
        <div className="no-print ml-12 mt-2">
          <button
            onClick={() => window.print()}
            className="text-xs text-[#C9883A] border border-[#C9883A]/40 rounded-full px-4 py-1.5 hover:bg-[#C9883A]/10 transition-colors"
          >
            🖨️ 印刷する
          </button>
        </div>
      )}
    </div>
  );
}
