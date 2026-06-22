// src/constants/chartColors.ts
export const CHART_COLOR_PALETTE = [
  { hex: "#10b981", bg: "bg-emerald-50 text-emerald-600" }, // 1번째 카테고리
  { hex: "#3b82f6", bg: "bg-blue-50 text-blue-600" }, // 2번째
  { hex: "#8b5cf6", bg: "bg-purple-50 text-purple-600" }, // 3번째
  { hex: "#f59e0b", bg: "bg-amber-50 text-amber-600" }, // 4번째
  { hex: "#ec4899", bg: "bg-pink-50 text-pink-600" }, // 5번째 (새 카테고리 추가시)
  { hex: "#06b6d4", bg: "bg-cyan-50 text-cyan-600" }, // 6번째
  { hex: "#84cc16", bg: "bg-lime-50 text-lime-600" }, // 7번째
  { hex: "#64748b", bg: "bg-slate-100 text-slate-600" }, // 8번째 이후는 회색 fallback
];

export function getChartColor(index: number) {
  return CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length];
}
