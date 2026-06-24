// src/pages/TodoManagePage.tsx
import { useState, useMemo } from "react";
import { useTodos } from "../hooks/useTodos";
import {
  getDateFilterOptions,
  getDateRangeForFilter,
  type DateFilterKey,
} from "../utils/dateRangeFilter";
import TodoStatsCards from "../components/TodoStatsCards";
import TodoManageList from "../components/TodoMangeList";

export default function TodoManagePage() {
  const { todos } = useTodos();
  const [filterKey, setFilterKey] = useState<DateFilterKey>("thisWeek");

  const filterOptions = useMemo(() => getDateFilterOptions(), []);

  const { start, end } = useMemo(
    () => getDateRangeForFilter(filterKey),
    [filterKey],
  );

  // 선택된 기간에 due_date(시작일)가 속하는 todo만 필터링
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (!todo.due_date) return false;
      return todo.due_date >= start && todo.due_date <= end;
    });
  }, [todos, start, end]);

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더: 타이틀 + 기간 필터 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">할 일 관리</h1>
          <p className="text-sm text-slate-500 mt-1">
            기간별로 할 일을 모아보고 정리해요.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilterKey(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap
                ${
                  filterKey === opt.key
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 상단 통계 카드 */}
      <TodoStatsCards todos={filteredTodos} />

      {/* 하단 리스트 */}
      <TodoManageList todos={filteredTodos} />
    </div>
  );
}
