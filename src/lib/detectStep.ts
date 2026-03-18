export type UserState = {
  step: number;
  age: string;
  budget: number;
  concerns: string[];
};

const AGE_PATTERN = /(10|20|30|40|50|60)代/;
const BUDGET_PATTERN = /(\d[\d,]*)\s*円|¥(\d[\d,]*)/;
const CONCERN_KEYWORDS = ["乾燥","シワ","シミ","毛穴","リフト","敏感肌","ニキビ","くすみ","ハリ","たるみ"];

export function detectStep(
  messages: { role: string; text: string }[],
  current: UserState
): UserState {
  const allText = messages.map((m) => m.text).join(" ");
  const next = { ...current };

  // 年代抽出
  if (!next.age) {
    const m = allText.match(AGE_PATTERN);
    if (m) {
      next.age = m[1];
      next.step = Math.max(next.step, 2);
    }
  }

  // 悩み抽出
  if (next.concerns.length === 0) {
    const found = CONCERN_KEYWORDS.filter((k) => allText.includes(k));
    if (found.length > 0) {
      next.concerns = found;
      next.step = Math.max(next.step, 3);
    }
  }

  // 予算抽出
  if (!next.budget) {
    const m = allText.match(BUDGET_PATTERN);
    if (m) {
      const raw = (m[1] || m[2]).replace(/,/g, "");
      next.budget = parseInt(raw, 10);
      next.step = Math.max(next.step, 6);
    }
  }

  // 提案フェーズ判定
  const lastAI = [...messages].reverse().find((m) => m.role === "model")?.text ?? "";
  if (lastAI.includes("手の届くところ") || lastAI.includes("おすすめ")) {
    next.step = Math.max(next.step, 7);
  }

  return next;
}
