// 색상 팔레트

export const COLOR_PALETTE = [
  {
    key: "blue",
    dot: "bg-blue-500",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    key: "navy",
    dot: "bg-indigo-800",
    classes: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  {
    key: "red",
    dot: "bg-red-500",
    classes: "bg-red-50 text-red-600 border-red-200",
  },
  {
    key: "pink",
    dot: "bg-pink-400",
    classes: "bg-pink-50 text-pink-600 border-pink-200",
  },
  {
    key: "orange",
    dot: "bg-orange-500",
    classes: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    key: "green",
    dot: "bg-emerald-600",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    key: "lime",
    dot: "bg-lime-500",
    classes: "bg-lime-50 text-lime-700 border-lime-200",
  },
  {
    key: "yellow",
    dot: "bg-yellow-400",
    classes: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    key: "teal",
    dot: "bg-teal-400",
    classes: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    key: "purple",
    dot: "bg-purple-500",
    classes: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    key: "violet",
    dot: "bg-violet-700",
    classes: "bg-violet-50 text-violet-800 border-violet-200",
  },
  {
    key: "gray",
    dot: "bg-slate-500",
    classes: "bg-slate-100 text-slate-700 border-slate-300",
  },
] as const;

export type ColorKey = (typeof COLOR_PALETTE)[number]["key"];

export function getColorStyle(colorKey: string) {
  return (
    COLOR_PALETTE.find((c) => c.key === colorKey)?.classes ??
    "bg-slate-100 text-slate-700 border-slate-300"
  );
}

export function getColorDot(colorKey: string) {
  return COLOR_PALETTE.find((c) => c.key === colorKey)?.dot ?? "bg-slate-500";
}
