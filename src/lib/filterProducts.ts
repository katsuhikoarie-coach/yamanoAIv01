import products from "@/data/products.json";

export type Product = (typeof products)[number];

export function filterProducts(
  age: string,
  budget: number,
  concerns: string[]
): Product[] {
  const ageKey = age.replace(/代$/, "");
  return products
    .filter(
      (p) =>
        p.age.includes(ageKey) &&
        p.price <= budget &&
        p.concern.some((c) => concerns.includes(c)) &&
        p.step !== "ヘア"
    )
    .sort((a, b) => a.price - b.price);
}
