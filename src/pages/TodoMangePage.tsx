// src/pages/TodoManagePage.tsx
import { useState, useMemo } from "react";
import { useTodos } from "../hooks/useTodos";
import {
  getDateFilterOptions,
  getDateRangeForFilter,
  type DateFilterKey,
} from "../utils/dateRangeFilter";
import TodoStatsCards from "../components/TodoStatsCards";
import TodoMangeList from "../components/TodoMangeList";

export default function TodoManagePage() {
  const { todos, setIsModalOpen } = useTodos();
  const [filterKey, setFilterKey] = useState<DateFilterKey>("thisWeek");

  // 카테고리 다중선택 필터 상태 (빈 배열 = 전체 보기)
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);

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
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm shadow-indigo-100 transition-all flex items-center gap-1"
        >
          <span>+</span> 할 일 등록
        </button>
      </div>

      {/* 상단 통계 카드 (기간 필터만 적용, 카테고리 필터는 미적용 - 전체 기간 통계 유지 목적) */}
      <TodoStatsCards todos={filteredTodos} />

      {/* 하단 리스트 (필터 툴바 포함) */}
      <TodoMangeList
        todos={filteredTodos}
        filterLabel={
          filterOptions.find((opt) => opt.key === filterKey)?.label ?? ""
        }
        filterOptions={filterOptions}
        filterKey={filterKey}
        onFilterChange={setFilterKey}
        categoryFilters={categoryFilters}
        onCategoryFiltersChange={setCategoryFilters}
      />
    </div>
  );
}
