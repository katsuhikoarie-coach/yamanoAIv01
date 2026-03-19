"use client";

const AGE_GROUPS = [
  "10代", "20代", "30代",
  "40代", "50代", "60代",
  "70代", "80代", "90代",
];

type Props = {
  onSelect: (age: string) => void;
  disabled: boolean;
};

export default function AgeSelector({ onSelect, disabled }: Props) {
  return (
    <div className="border-t border-[#C9883A]/20 bg-[#F9F5EF] px-4 py-4">
      <p className="text-center text-sm text-[#2D4A3E]/60 mb-3">年代を選択してください</p>
      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
        {AGE_GROUPS.map((age) => (
          <button
            key={age}
            onClick={() => onSelect(age)}
            disabled={disabled}
            className="bg-[#2D4A3E] text-white rounded-2xl py-3 text-base font-serif tracking-wider hover:bg-[#1e3329] active:scale-95 disabled:opacity-40 transition-all"
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  );
}
