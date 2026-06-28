// src/components/TodoStatsCards.tsx
import type { Todo } from "../context/TodoContext";

type Props = {
  todos: Todo[];
};

export default function TodoStatsCards({ todos }: Props) {
  const total = todos.length;
  const completed = todos.filter((t) => t.is_completed).length;
  const incomplete = total - completed;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const cards = [
    {
      label: "총 할 일",
      value: total,
      unit: "건",
      accent: "text-slate-800",
    },
    {
      label: "완료",
      value: completed,
      unit: "건",
      accent: "text-indigo-600",
    },
    {
      label: "미완료",
      value: incomplete,
      unit: "건",
      accent: "text-slate-500",
    },
    {
      label: "달성률",
      value: rate,
      unit: "%",
      accent: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          // bg-gradient-to-b from-transparent to-indigo-100/20
          className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-2 "
        >
          <span className="text-xs font-semibold text-gray-500">
            {card.label}
          </span>
          <span className={`text-2xl font-bold ${card.accent}`}>
            {card.value}
            <span className="text-sm font-semibold ml-0.5">{card.unit}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
