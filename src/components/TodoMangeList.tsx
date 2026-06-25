import { useState } from "react";
import type { Todo } from "../context/TodoContext";
import { useTodos } from "../hooks/useTodos";
import { getColorDot } from "../constants/colorPalette";
import {
  IconMessageDots,
  IconSearch,
  IconChevronDown,
  IconFilter,
  IconX,
  IconListTree,
} from "@tabler/icons-react";
import type { DateFilterKey } from "../utils/dateRangeFilter";

type FilterOption = { key: DateFilterKey; label: string };
type CompletionFilter = "all" | "completed" | "incomplete";

const completionOptions: { key: CompletionFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "completed", label: "완료" },
  { key: "incomplete", label: "미완료" },
];

type Props = {
  todos: Todo[];
  filterLabel: string;
  filterOptions: FilterOption[];
  filterKey: DateFilterKey;
  onFilterChange: (key: DateFilterKey) => void;
  categoryFilters: string[];
  onCategoryFiltersChange: (categories: string[]) => void;
};

function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function TodoMangeList({
  todos,
  filterLabel,
  filterOptions,
  filterKey,
  onFilterChange,
  categoryFilters,
  onCategoryFiltersChange,
}: Props) {
  const { toggleTodo, setEditingTodo, setIsModalOpen, categories } = useTodos();
  const todayStr = getTodayStr();

  // 드롭다운 열림 상태
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  // 검색창 펼침 상태 + 검색어
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // 완료 상태 필터
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>("all");
  // 그룹 접기/펴기 (key별 접힘 여부, 기본 펴짐)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );

  const handleRowClick = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleToggle = (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    toggleTodo(todo.id, todo.is_completed);
  };

  const handleSelectPeriod = (key: DateFilterKey) => {
    onFilterChange(key);
    setIsPeriodOpen(false);
  };

  const handleSelectView = (key: CompletionFilter) => {
    setCompletionFilter(key);
    setIsViewOpen(false);
  };

  const handleToggleCategory = (name: string) => {
    if (categoryFilters.includes(name)) {
      onCategoryFiltersChange(categoryFilters.filter((c) => c !== name));
    } else {
      onCategoryFiltersChange([...categoryFilters, name]);
    }
  };

  const handleRemoveCategoryChip = (name: string) => {
    onCategoryFiltersChange(categoryFilters.filter((c) => c !== name));
  };

  const handleClearCategoryFilters = () => {
    onCategoryFiltersChange([]);
  };

  const handleSearchIconClick = () => {
    if (isSearchOpen && searchQuery === "") {
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(true);
    }
  };

  const toggleGroupCollapse = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // 1차: 완료 상태 필터
  const completionFilteredTodos = todos.filter((todo) => {
    if (completionFilter === "completed") return todo.is_completed;
    if (completionFilter === "incomplete") return !todo.is_completed;
    return true;
  });

  // 2차: 카테고리 필터 (빈 배열이면 전체 통과)
  const categoryFilteredTodos =
    categoryFilters.length === 0
      ? completionFilteredTodos
      : completionFilteredTodos.filter((todo) =>
          categoryFilters.includes(todo.category),
        );

  // 3차: 검색어 필터 (title 기준, 대소문자 무시)
  const searchedTodos = categoryFilteredTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // due_date 기준 내림차순 정렬 (최신 날짜부터)
  const sortedTodos = [...searchedTodos].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return b.due_date.localeCompare(a.due_date);
  });

  // Today / 나머지(필터명) 그룹으로 분리
  const todayTodos = sortedTodos.filter((t) => t.due_date === todayStr);
  const restTodos = sortedTodos.filter((t) => t.due_date !== todayStr);

  // Today / filterlabel
  const groups = [
    {
      key: "today",
      label: "오늘",
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
      className={`flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50/70 transition-colors
        ${!isLast ? "border-b border-slate-100" : ""}
      `}
    >
      {/* 체크박스 (완료 토글, 대시보드 스타일과 통일) */}
      <button
        onClick={(e) => handleToggle(e, todo)}
        className="relative flex items-center justify-center shrink-0"
        aria-label={todo.is_completed ? "완료 취소" : "완료 처리"}
      >
        <input
          type="checkbox"
          checked={todo.is_completed}
          readOnly
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
            ${
              todo.is_completed
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-slate-200 bg-white hover:border-indigo-300"
            }`}
        >
          {todo.is_completed && (
            <svg
              className="w-3 h-3 fill-none stroke-current stroke-[3]"
              viewBox="0 0 24 24"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
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
          <IconMessageDots
            size={14}
            stroke={2}
            className="text-slate-400 shrink-0"
          />
          <span className="text-xs text-slate-400 truncate">{todo.memo}</span>
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

  return (
    <div>
      {/* 툴바: View(완료상태) + Filters(카테고리) + 칩 + 기간 + 검색 */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 flex-wrap">
        {/* View 드롭다운 (완료 상태) */}
        <div className="relative">
          <button
            onClick={() => setIsViewOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors
              ${
                completionFilter !== "all"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
          >
            <IconListTree size={14} stroke={2} />
            View
          </button>

          {isViewOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsViewOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[100px]">
                {completionOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectView(opt.key)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors
                      ${
                        completionFilter === opt.key
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-px h-4 bg-slate-200" />

        {/* Filters 버튼 (카테고리 다중선택) */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors
              ${
                categoryFilters.length > 0
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
          >
            <IconFilter size={14} stroke={2} />
            Filters
          </button>

          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 min-w-[160px]">
                {categories.map((cat) => {
                  const checked = categoryFilters.includes(cat.name);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleToggleCategory(cat.name)}
                      className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0
                          ${
                            checked
                              ? "bg-indigo-600 border-indigo-600"
                              : "border-slate-300"
                          }`}
                      >
                        {checked && (
                          <span className="text-white text-[9px] leading-none">
                            ✓
                          </span>
                        )}
                      </span>
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* 선택된 카테고리 칩 목록 */}
        {categoryFilters.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {categoryFilters.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700"
              >
                {name}
                <button
                  onClick={() => handleRemoveCategoryChip(name)}
                  className="hover:text-slate-900 transition-colors"
                  aria-label={`${name} 필터 제거`}
                >
                  <IconX size={12} stroke={2.5} />
                </button>
              </span>
            ))}
            <button
              onClick={handleClearCategoryFilters}
              className="text-xs font-medium text-slate-700 hover:text-slate-600 transition-colors ml-1"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* 우측: 기간 + 검색 */}
        <div className="flex items-center gap-2 ml-auto">
          {/* 기간 드롭다운 (기존 기간 필터, 라벨 없이 현재값만 표시) */}
          <div className="relative">
            <button
              onClick={() => setIsPeriodOpen((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              {filterLabel}
              <IconChevronDown size={14} stroke={2} />
            </button>

            {isPeriodOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsPeriodOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectPeriod(opt.key)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors
                        ${
                          filterKey === opt.key
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 검색 */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSearchIconClick}
              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="검색"
            >
              <IconSearch size={15} stroke={2} />
            </button>

            {isSearchOpen && (
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요..."
                className="text-xs text-slate-700 placeholder:text-slate-400 outline-none bg-transparent w-40"
              />
            )}
          </div>
        </div>
      </div>
      {/* 테이블 헤더 */}
      <div className="flex items-center gap-3 px-5 py-2.5 mb-4 bg-slate-50/60 border-b-1 border-[#e0e0e0]">
        <span className="w-5 shrink-0" />
        <span className="w-1.5 shrink-0" />
        <span className="flex-1 min-w-0 text-xs font-bold text-slate-700 tracking-wide">
          NAME
        </span>
        <span className="w-32 text-xs font-bold text-slate-700 tracking-wide">
          DESCRIPTION
        </span>
        <span className="text-xs font-bold text-slate-700 tracking-wide shrink-0 w-20 text-center">
          CATEGORY
        </span>
        <span className="text-xs font-bold text-slate-700 tracking-wide shrink-0 w-24 text-right">
          DUE DATE
        </span>
      </div>
      {/* 리스트 */}
      <div className="bg-white border border-slate-100 overflow-hidden">
        {sortedTodos.length === 0 ? (
          <div className="p-12 flex items-center justify-center">
            <p className="text-sm text-slate-400">
              선택한 조건에 해당하는 할 일이 없어요.
            </p>
          </div>
        ) : (
          groups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.key);

            return (
              <div key={group.key}>
                {/* 그룹 헤더 (클릭하면 접기/펴기) */}
                <button
                  onClick={() => toggleGroupCollapse(group.key)}
                  className={`w-full flex items-center gap-2 px-5 py-2.5 transition-colors ${
                    group.accent === "dark" ? "bg-indigo-100" : "bg-indigo-100"
                  }`}
                >
                  <IconChevronDown
                    size={14}
                    stroke={2.5}
                    className={`text-slate-500 transition-transform ${
                      isCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                  {/* <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      group.accent === "dark"
                        ? "bg-indigo-500"
                        : "bg-indigo-500"
                    }`}
                  /> */}
                  <span className="text-xs font-semibold tracking-wide text-black">
                    {group.label}
                  </span>
                  <div
                    className={`bg-white rounded-sm border w-4 h-4 flex items-center justify-center ${
                      group.accent === "dark"
                        ? "border-indigo-500"
                        : "border-indigo-500"
                    }`}
                  >
                    <span
                      className={`text-[11px] translate-y-[1px] font-semibold ${
                        group.accent === "dark"
                          ? "text-indigo-500"
                          : "text-indigo-500"
                      }`}
                    >
                      {group.items.length}
                    </span>
                  </div>
                </button>

                {!isCollapsed &&
                  group.items.map((todo, idx) =>
                    renderRow(todo, idx === group.items.length - 1),
                  )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
