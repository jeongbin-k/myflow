// src/components/TodoMangeList.tsx
import type { Todo } from "../context/TodoContext";
import { useTodos } from "../hooks/useTodos";
import { getColorDot } from "../constants/colorPalette";
import { IconMessageDots } from "@tabler/icons-react";

type Props = {
  todos: Todo[];
  filterLabel: string;
};

function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function TodoMangeList({ todos, filterLabel }: Props) {
  const { toggleTodo, setEditingTodo, setIsModalOpen } = useTodos();
  const todayStr = getTodayStr();

  const handleRowClick = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleToggle = (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    toggleTodo(todo.id, todo.is_completed);
  };

  // due_date 기준 내림차순 정렬 (최신 날짜부터)
  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return b.due_date.localeCompare(a.due_date);
  });

  // Today / 나머지(필터명) 그룹으로 분리
  const todayTodos = sortedTodos.filter((t) => t.due_date === todayStr);
  const restTodos = sortedTodos.filter((t) => t.due_date !== todayStr);

  const groups = [
    {
      key: "today",
      label: "Today",
      items: todayTodos,
      accent: "dark" as const,
    },
    {
      key: "rest",
      label: filterLabel,
      items: restTodos,
      accent: "light" as const,
    },
  ].filter((g) => g.items.length > 0);

  const renderRow = (todo: Todo, isLast: boolean) => (
    <div
      key={todo.id}
      onClick={() => handleRowClick(todo)}
      className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-slate-50/70 transition-colors
        ${!isLast ? "border-b border-slate-100" : ""}
      `}
    >
      {/* 체크박스 */}
      <button
        onClick={(e) => handleToggle(e, todo)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
          ${
            todo.is_completed
              ? "bg-indigo-600 border-indigo-600"
              : "border-slate-300 hover:border-indigo-400"
          }
        `}
        aria-label={todo.is_completed ? "완료 취소" : "완료 처리"}
      >
        {todo.is_completed && (
          <span className="text-white text-[10px] leading-none">✓</span>
        )}
      </button>
      {/* 색상 dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${getColorDot(todo.color)}`}
      />
      {/* 제목 */}
      <span
        className={`flex-1 min-w-0 truncate text-sm font-medium
          ${
            todo.is_completed ? "text-slate-400 line-through" : "text-slate-700"
          }
        `}
      >
        {todo.title}
      </span>
      {/* 메모 아이콘 (메모 있을 때만) */}
      {todo.memo && (
        <div className="w-30 flex items-center gap-1 shrink-0">
          {todo.memo && (
            <>
              <IconMessageDots
                size={14}
                stroke={2}
                className="text-slate-400 shrink-0"
              />

              <span className="text-xs text-slate-400 truncate">
                {todo.memo}
              </span>
            </>
          )}
        </div>
      )}
      {/* 카테고리 칩 */}
      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 shrink-0 whitespace-nowrap w-20 text-center">
        {todo.category}
      </span>
      {/* 날짜 */}
      <span className="text-xs text-slate-400 shrink-0 w-24 text-right whitespace-nowrap">
        {todo.due_date}
      </span>
    </div>
  );

  if (sortedTodos.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-12 flex items-center justify-center">
        <p className="text-sm text-slate-400">
          선택한 기간에 해당하는 할 일이 없어요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      {/* 테이블 헤더 */}
      <div className="flex items-center gap-3 px-5 py-2.5 bg-white border-b border-slate-100">
        <span className="w-5 shrink-0" />

        <span className="w-1.5 shrink-0" />

        <span className="flex-1 min-w-0 text-[11px] font-bold  text-gray-600 tracking-wide">
          NAME
        </span>

        <span className="w-32 text-[11px] font-bold text-gray-600 tracking-wide">
          DESCRIPTION
        </span>

        <span className="text-[11px] font-bold text-gray-600 tracking-wide shrink-0 w-20 text-center">
          CATEGORY
        </span>

        <span className="text-[11px] font-bold text-gray-600  tracking-wide shrink-0 w-24 text-right">
          DUE DATE
        </span>
      </div>

      {groups.map((group) => (
        <div key={group.key}>
          {/* 그룹 헤더 */}
          <div
            className={`flex items-center gap-2 px-5 py-2 ${
              group.accent === "dark" ? "bg-indigo-100" : "bg-[#fdf7ed]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                group.accent === "dark" ? "bg-indigo-500" : "bg-orange-500"
              }`}
            />
            <span
              className={`text-xs font-semibold tracking-wide ${
                group.accent === "dark" ? "text-black" : "text-black"
              }`}
            >
              {group.label}
            </span>
            <div
              className={`bg-white rounded-sm border w-4 h-4 flex items-center justify-center ${group.accent === "dark" ? "border-indigo-500" : "border-orange-500"}`}
            >
              <span
                className={`text-[11px] translate-y-[1px] font-semibold ${
                  group.accent === "dark"
                    ? "text-indigo-500"
                    : "text-orange-500"
                }`}
              >
                {group.items.length}
              </span>
            </div>
          </div>

          {group.items.map((todo, idx) =>
            renderRow(todo, idx === group.items.length - 1),
          )}
        </div>
      ))}
    </div>
  );
}
