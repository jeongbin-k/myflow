// src/components/TodoManageList.tsx
import type { Todo } from "../context/TodoContext";
import { useTodos } from "../hooks/useTodos";
import { getColorDot } from "../constants/colorPalette";
import { IconMessageCircle } from "@tabler/icons-react";

type Props = {
  todos: Todo[];
};

export default function TodoManageList({ todos }: Props) {
  const { toggleTodo, setEditingTodo, setIsModalOpen } = useTodos();

  const handleRowClick = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleToggle = (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    toggleTodo(todo.id, todo.is_completed);
  };

  // due_date 기준 오름차순 정렬 (가까운 날짜부터)
  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date.localeCompare(b.due_date);
  });

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
      {sortedTodos.map((todo, idx) => (
        <div
          key={todo.id}
          onClick={() => handleRowClick(todo)}
          className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-slate-50/70 transition-colors
            ${idx !== sortedTodos.length - 1 ? "border-b border-slate-100" : ""}
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
                todo.is_completed
                  ? "text-slate-400 line-through"
                  : "text-slate-700"
              }
            `}
          >
            {todo.title}
          </span>

          {/* 카테고리 칩 */}
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 shrink-0 whitespace-nowrap">
            {todo.category}
          </span>

          {/* 메모 아이콘 (메모 있을 때만) */}
          {todo.memo && (
            <span className="flex items-center gap-1 text-slate-400 shrink-0">
              <IconMessageCircle size={15} stroke={2} />
            </span>
          )}

          {/* 날짜 */}
          <span className="text-xs text-slate-400 shrink-0 w-20 text-right whitespace-nowrap">
            {todo.due_date}
          </span>
        </div>
      ))}
    </div>
  );
}
