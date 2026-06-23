import { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import {
  generateMonthGrid,
  chunkIntoWeeks,
  layoutEventsForWeek,
} from "../utils/calendarLayout";
import { getColorDot } from "../constants/colorPalette";

type Props = {
  onNavigate: (menu: string) => void;
};

function getTodayParts() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const LANE_HEIGHT = 16;
const LANE_GAP = 2;
const LANES_TOP_OFFSET = 30;
const MAX_VISIBLE_LANES = 1;

export default function MainCalendar({ onNavigate }: Props) {
  const { todos } = useTodos();
  const today = getTodayParts();

  const [viewType, setViewType] = useState("monthly");
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);

  const todayStr = `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`;

  const monthDays = generateMonthGrid(viewYear, viewMonth);
  const weeks = chunkIntoWeeks(monthDays);

  const visibleWeeks =
    viewType === "weekly"
      ? weeks.filter((week) => week.some((cell) => cell.dateStr === todayStr))
      : weeks;

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setViewYear(today.year);
    setViewMonth(today.month);
  };

  return (
    <div className="w-full h-[440px] bg-white border border-slate-100 rounded-2xl p-6  flex flex-col">
      {/* 헤더: 월 이동 */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">
            {viewYear}년 {viewMonth}월
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              &lt;
            </button>
            <button
              onClick={handleNextMonth}
              className="w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 cursor-pointer outline-none"
          >
            <option value="monthly">Month</option>
            <option value="weekly">Week</option>
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
        {visibleWeeks.map((week, weekIdx) => {
          const eventBars = layoutEventsForWeek(week, todos);
          const visibleBars =
            viewType === "weekly"
              ? eventBars
              : eventBars.filter((bar) => bar.lane < MAX_VISIBLE_LANES);

          return (
            <div
              key={weekIdx}
              className="relative grid grid-cols-7 flex-1 border-b border-slate-100 last:border-b-0"
            >
              {/* 날짜 숫자 + 클릭 영역 레이어 */}
              {week.map((cell, cellIdx) => {
                const isToday = cell.dateStr === todayStr;
                const isSunday = cellIdx === 0;
                const isSaturday = cellIdx === 6;

                const totalForDay = eventBars.filter((bar) => {
                  const barStartDate = week[bar.startCol].dateStr;
                  const barEndDate = week[bar.startCol + bar.span - 1].dateStr;
                  return (
                    cell.dateStr >= barStartDate && cell.dateStr <= barEndDate
                  );
                }).length;

                // 월간이거나 주간일때
                const hiddenCount =
                  viewType === "weekly" ? 0 : totalForDay - MAX_VISIBLE_LANES;

                return (
                  <div
                    key={cellIdx}
                    onClick={() => onNavigate("calendar")}
                    className="relative border-r border-slate-100 last:border-r-0 p-1.5 flex flex-col items-start min-h-12.5 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <span
                      className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full
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
                          onNavigate("calendar");
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-600 font-semibold transition-colors"
                        style={{
                          marginTop: `${LANES_TOP_OFFSET + MAX_VISIBLE_LANES * (LANE_HEIGHT + LANE_GAP) - 22}px`,
                        }}
                      >
                        +{hiddenCount}건
                      </button>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate("calendar");
                      }}
                      title={bar.todo.title}
                      className="absolute pointer-events-auto cursor-pointer flex items-center gap-1 rounded-md bg-slate-100 px-1 hover:bg-slate-200 transition-colors"
                      style={{
                        left: `calc(${leftPct}% + 2px)`,
                        width: `calc(${widthPct}% - 4px)`,
                        top: `${top}px`,
                        height: `${LANE_HEIGHT}px`,
                      }}
                    >
                      <span
                        className={`w-0.5 h-2.5 rounded-full shrink-0 ${getColorDot(bar.todo.color)}`}
                      />
                      <span
                        className={`truncate text-[10px]  leading-none ${
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
        })}
      </div>
    </div>
  );
}
