import { useMemo, useState } from "react";
import { useTodos } from "../hooks/useTodos";
import type { Todo } from "../context/TodoContext";
import { getColorStyle } from "../constants/colorPalette";

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

export default function MainCalendar({ onNavigate }: Props) {
  const { todos } = useTodos();

  const today = getTodayParts();
  const [currentYear, setCurrentYear] = useState(today.year);
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [viewType, setViewType] = useState("monthly");

  // todos를 due_date 기준으로 그룹핑: { "2026-6-3": [todo, todo], ... }
  // 키 형식을 due_date("2026-06-03")가 아니라 "2026-6-3"(0패딩 없음)으로 통일
  const eventsByDate = useMemo(() => {
    const map: Record<string, Todo[]> = {};

    todos.forEach((todo) => {
      if (!todo.due_date) return;

      const [y, m, d] = todo.due_date.split("-").map(Number);
      const key = `${y}-${m}-${d}`; // 0패딩 없는 키로 통일

      if (!map[key]) map[key] = [];
      map[key].push(todo);
    });

    return map;
  }, [todos]);

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

    const totalDays = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const daysArray: { type: string; day: number | string }[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push({ type: "prev", day: "" });
    }
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push({ type: "current", day: i });
    }

    if (viewType === "weekly") {
      // 오늘이 이 달에 없으면(다른 달 보는 중이면) 1일이 속한 주를 기준으로
      const todayIdx = daysArray.findIndex(
        (item) =>
          item.type === "current" &&
          item.day === today.day &&
          currentMonth === today.month &&
          currentYear === today.year,
      );
      const baseIdx = todayIdx !== -1 ? todayIdx : 0;
      const startOfWeekIdx = Math.floor(baseIdx / 7) * 7;
      return daysArray.slice(startOfWeekIdx, startOfWeekIdx + 7);
    }
    return daysArray;
  };

  const calendarDays = generateCalendarDays();

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(today.year);
    setCurrentMonth(today.month);
  };

  return (
    <div className="w-full h-[440px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            {currentYear}년 {currentMonth}월
          </h2>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <button
              onClick={handlePrevMonth}
              className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 text-sm font-semibold transition-all"
            >
              &lt;
            </button>
            <button
              onClick={handleNextMonth}
              className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 text-sm font-semibold transition-all"
            >
              &gt;
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs text-slate-600 border-x border-slate-200 font-medium"
            >
              오늘
            </button>
          </div>
        </div>

        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 cursor-pointer outline-none"
        >
          <option value="monthly">월간 보기</option>
          <option value="weekly">주간 보기</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-7 text-center border-b border-slate-200 pb-2 text-xs font-semibold text-slate-400 tracking-wider">
          {weekdays.map((day, idx) => (
            <div
              key={idx}
              className={`${day === "일" || day === "토" ? "text-red-400" : ""}`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1 pt-1">
          {calendarDays.map((item, idx) => {
            const isSunday = idx % 7 === 0;
            const isSaturday = idx % 7 === 6;
            const isToday =
              item.day === today.day &&
              currentMonth === today.month &&
              currentYear === today.year;

            const eventKey = `${currentYear}-${currentMonth}-${item.day}`;
            const events =
              item.type === "current" ? (eventsByDate[eventKey] ?? []) : [];

            const maxVisibleEvents = viewType === "weekly" ? 10 : 1;
            const visibleEvents = events.slice(0, maxVisibleEvents);
            const hiddenCount = Math.max(0, events.length - maxVisibleEvents);

            return (
              <div
                key={idx}
                className="border-b border-r border-slate-100 p-1 flex flex-col items-start min-h-12.5"
              >
                <span
                  className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full
                    ${item.type === "prev" ? "text-transparent" : "text-slate-700"}
                    ${item.type === "current" && isSunday ? "text-red-500" : ""}
                    ${item.type === "current" && isSaturday ? "text-indigo-500" : ""}
                    ${isToday ? "bg-indigo-600 !text-white" : ""}
                  `}
                >
                  {item.day}
                </span>

                <div className="w-full mt-1 flex flex-col gap-0.5">
                  {visibleEvents.map((todo) => (
                    <div
                      key={todo.id}
                      className={`text-[10px] font-bold px-1 rounded-sm truncate ${getColorStyle(todo.color)}`}
                    >
                      ● {todo.title}
                    </div>
                  ))}

                  {hiddenCount > 0 && (
                    <button
                      onClick={() => onNavigate("calendar")}
                      className="text-[10px] text-indigo-400 hover:text-indigo-600 text-left transition-colors"
                    >
                      +{hiddenCount} 더보기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
