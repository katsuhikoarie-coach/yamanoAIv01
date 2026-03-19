export type UserState = {
  step: number;
  age: string;
  budget: number;
  concerns: string[];
};

// 「50代」など十年単位
const AGE_DECADE_PATTERN = /(10|20|30|40|50|60|70|80|90)代/;
// 「51歳」「51才」など具体的な数字
const AGE_NUMBER_PATTERN = /(\d{1,2})\s*[歳才]/;
const BUDGET_PATTERN = /(\d[\d,]*)\s*円|¥(\d[\d,]*)/;
const CONCERN_KEYWORDS = ["乾燥","シワ","シミ","毛穴","リフト","敏感肌","ニキビ","くすみ","ハリ","たるみ"];

export function detectStep(
  messages: { role: string; text: string }[],
  current: UserState
): UserState {
  const allText = messages.map((m) => m.text).join(" ");
  const next = { ...current };

  // 年代抽出（「50代」→"50"、「51歳」「51才」→"50" に正規化）
  if (!next.age) {
    try {
      const m = allText.match(AGE_DECADE_PATTERN);
      if (m) {
        next.age = m[1];
        next.step = Math.max(next.step, 2);
      } else {
        const m2 = allText.match(AGE_NUMBER_PATTERN);
        if (m2) {
          const num = parseInt(m2[1], 10);
          if (!isNaN(num) && num >= 10 && num <= 99) {
            next.age = String(Math.floor(num / 10) * 10);
            next.step = Math.max(next.step, 2);
          }
        }
      }
    } catch {
      // 年代抽出失敗時はスキップして続行
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
    try {
      const m = allText.match(BUDGET_PATTERN);
      if (m) {
        const raw = (m[1] || m[2]).replace(/,/g, "");
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed) && parsed > 0) {
          next.budget = parsed;
          next.step = Math.max(next.step, 6);
        }
      }
    } catch {
      // 予算抽出失敗時はスキップして続行
    }
  }

  // 提案フェーズ判定
  const lastAI = [...messages].reverse().find((m) => m.role === "model")?.text ?? "";
  if (lastAI.includes("手の届くところ") || lastAI.includes("おすすめ")) {
    next.step = Math.max(next.step, 7);
  }

  return next;
}
