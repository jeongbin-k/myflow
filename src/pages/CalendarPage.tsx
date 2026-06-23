import { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import type { Todo } from "../context/TodoContext";
import {
  generateMonthGrid,
  chunkIntoWeeks,
  layoutEventsForWeek,
} from "../utils/calendarLayout";
import { getColorDot } from "../constants/colorPalette";
import CalendarSidebar from "../components/CalendarSidebar";

function getTodayParts() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const LANE_HEIGHT = 20;
const LANE_GAP = 2;
const LANES_TOP_OFFSET = 32;
const MAX_VISIBLE_LANES = 3;

export default function CalendarPage() {
  const { todos, setEditingTodo, setIsModalOpen, openModalForDate } =
    useTodos();

  const today = getTodayParts();
  const todayStr = `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`;

  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);

  // 현재 선택된(클릭된) 날짜. defualt 오늘날짜
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  // viewMode state
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const monthDays = generateMonthGrid(viewYear, viewMonth);
  const weeks = chunkIntoWeeks(monthDays);

  const shiftDateByDays = (dateStr: string, days: number) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d + days);
    const ny = date.getFullYear();
    const nm = String(date.getMonth() + 1).padStart(2, "0");
    const nd = String(date.getDate()).padStart(2, "0");
    return `${ny}-${nm}-${nd}`;
  };

  const handlePrev = () => {
    if (viewMode === "week") {
      const newDate = shiftDateByDays(selectedDate ?? todayStr, -7);
      const [ny, nm] = newDate.split("-").map(Number);
      setSelectedDate(newDate);
      setViewYear(ny);
      setViewMonth(nm);
    } else {
      if (viewMonth === 1) {
        setViewYear((y) => y - 1);
        setViewMonth(12);
      } else {
        setViewMonth((m) => m - 1);
      }
    }
  };

  const handleNext = () => {
    if (viewMode === "week") {
      const newDate = shiftDateByDays(selectedDate ?? todayStr, 7);
      const [ny, nm] = newDate.split("-").map(Number);
      setSelectedDate(newDate);
      setViewYear(ny);
      setViewMonth(nm);
    } else {
      if (viewMonth === 12) {
        setViewYear((y) => y + 1);
        setViewMonth(1);
      } else {
        setViewMonth((m) => m + 1);
      }
    }
  };

  const handleToday = () => {
    setViewYear(today.year);
    setViewMonth(today.month);
    setSelectedDate(todayStr);
  };

  // 날짜 칸 클릭: 처음 클릭이면 선택, 이미 선택된 날짜를 또 클릭하면 추가모달
  const handleCellClick = (dateStr: string) => {
    if (selectedDate === dateStr) {
      openModalForDate(dateStr);
    } else {
      setSelectedDate(dateStr);
    }
  };

  // 막대(이벤트 바) 또는 사이드바 항목 클릭: 바로 수정모달
  const handleEventClick = (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation(); // 부모 셀의 onClick(선택/추가) 발동 방지
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSidebarSelectTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // 특정 날짜에 걸쳐있는 todo 전체를 due_date~end_date 기준으로 필터링
  const getTodosForDate = (dateStr: string) => {
    return todos.filter((todo) => {
      if (!todo.due_date) return false;
      const start = todo.due_date;
      const end = todo.end_date ?? todo.due_date;
      return dateStr >= start && dateStr <= end;
    });
  };

  return (
    <div className="flex h-full bg-white rounded-2xl border border-slate-100  p-6">
      {/* 캘린더 영역 */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* 헤더: 월 이동 */}
        <div className="flex items-center justify-between mb-4 shrink-0 pr-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800">
              {viewYear}년 {viewMonth}월
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 text-sm font-semibold transition-colors"
              >
                &lt;
              </button>
              <button
                onClick={handleNext}
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 text-sm font-semibold transition-colors"
              >
                &gt;
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as "month" | "week")}
              className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 cursor-pointer outline-none"
            >
              <option value="month">Month View</option>
              <option value="week">Week View</option>
            </select>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 text-center border-b border-slate-200 pb-2 text-xs font-semibold text-slate-400 tracking-wider shrink-0">
          {weekdays.map((day, idx) => (
            <div
              key={idx}
              className={
                day === "일"
                  ? "text-red-400"
                  : day === "토"
                    ? "text-indigo-400"
                    : ""
              }
            >
              {day}
            </div>
          ))}
        </div>

        {/* 6주 그리드 */}
        <div className="flex-1 flex flex-col">
          {(() => {
            const visibleWeeks =
              viewMode === "week" && selectedDate
                ? weeks.filter((week) =>
                    week.some((cell) => cell.dateStr === selectedDate),
                  )
                : weeks;

            return visibleWeeks.map((week, weekIdx) => {
              const eventBars = layoutEventsForWeek(week, todos);
              const visibleBars = eventBars.filter(
                (bar) => bar.lane < MAX_VISIBLE_LANES,
              );

              return (
                <div
                  key={weekIdx}
                  className="relative grid grid-cols-7 flex-1 border-b border-slate-100 last:border-b-0"
                >
                  {/* 날짜 숫자 + 클릭 영역 레이어 */}
                  {week.map((cell, cellIdx) => {
                    const isToday = cell.dateStr === todayStr;
                    const isSelected = cell.dateStr === selectedDate;
                    const isSunday = cellIdx === 0;
                    const isSaturday = cellIdx === 6;

                    const totalForDay = eventBars.filter((bar) => {
                      const barStartDate = week[bar.startCol].dateStr;
                      const barEndDate =
                        week[bar.startCol + bar.span - 1].dateStr;
                      return (
                        cell.dateStr >= barStartDate &&
                        cell.dateStr <= barEndDate
                      );
                    }).length;
                    const hiddenCount = totalForDay - MAX_VISIBLE_LANES;

                    return (
                      <div
                        key={cellIdx}
                        onClick={() => handleCellClick(cell.dateStr)}
                        className="relative border-r border-slate-100 last:border-r-0 p-2 flex flex-col items-start min-h-[100px] cursor-pointer hover:bg-slate-50/60 transition-colors"
                      >
                        <span
                          className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full
      ${cell.type !== "current" ? "text-slate-300" : "text-slate-700"}
      ${cell.type === "current" && isSunday ? "text-red-500" : ""}
      ${cell.type === "current" && isSaturday ? "text-indigo-500" : ""}
      ${isToday ? "bg-indigo-600 !text-white" : ""}
    `}
                        >
                          {cell.day}
                        </span>

                        {hiddenCount > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(cell.dateStr);
                            }}
                            className="text-[10px] text-indigo-400 hover:text-indigo-600 font-semibold transition-colors"
                            style={{
                              marginTop: `${LANES_TOP_OFFSET + MAX_VISIBLE_LANES * (LANE_HEIGHT + LANE_GAP) - 32}px`,
                            }}
                          >
                            +{hiddenCount}건
                          </button>
                        )}

                        {isSelected && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-100/80 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600" />
                          </>
                        )}
                      </div>
                    );
                  })}

                  {/* 이벤트 바 레이어 */}
                  <div className="absolute inset-0 pointer-events-none">
                    {visibleBars.map((bar) => {
                      const leftPct = (bar.startCol / 7) * 100;
                      const widthPct = (bar.span / 7) * 100;
                      const top =
                        LANES_TOP_OFFSET + bar.lane * (LANE_HEIGHT + LANE_GAP);

                      return (
                        <div
                          key={`${bar.todo.id}-${bar.startCol}`}
                          onClick={(e) => handleEventClick(e, bar.todo)}
                          title={bar.todo.title}
                          className="absolute pointer-events-auto cursor-pointer flex items-center gap-1.5 rounded-md bg-slate-100 px-1.5 hover:bg-slate-200 transition-colors"
                          style={{
                            left: `calc(${leftPct}% + 2px)`,
                            width: `calc(${widthPct}% - 4px)`,
                            top: `${top}px`,
                            height: `${LANE_HEIGHT}px`,
                          }}
                        >
                          <span
                            className={`w-0.5 h-3 rounded-full shrink-0 ${getColorDot(bar.todo.color)}`}
                          />
                          <span
                            className={`truncate text-[11px] leading-none ${
                              bar.todo.is_completed
                                ? "text-slate-400 line-through"
                                : "text-slate-700"
                            }`}
                          >
                            {bar.todo.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-px bg-slate-100 shrink-0" />

      {/* 사이드바: 항상 표시 */}
      <CalendarSidebar
        dateStr={selectedDate}
        todos={selectedDate ? getTodosForDate(selectedDate) : []}
        onSelectTodo={handleSidebarSelectTodo}
      />
    </div>
  );
}
