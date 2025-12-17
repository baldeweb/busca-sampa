import type { PriceRange } from "./PriceRange";

export function getPriceRangeLabel(price: PriceRange): string {
  switch (price) {
    case "FREE":
      return "Gratuito";
    case "ECONOMIC":
      return "Econômico (R$20 - R$59)";
    case "MODERATE":
      return "Moderado (R$50 - R$79)";
    case "EXPENSIVE":
      return "Caro (R$80 - R$149)";
    case "VERY-EXPENSIVE":
      return "Acima da média: R$150+";
    default:
      return "-";
  }
}
