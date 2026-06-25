// src/components/DateRangeCalendar.tsx
import { useState } from "react";

type Props = {
  startDate: string; // "YYYY-MM-DD"
  endDate: string;
  onChange: (start: string, end: string) => void;
};

function getTodayParts() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

function toDateStr(year: number, month: number, day: number) {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

// "YYYY-MM-DD" -> 비교/정렬용 Date 객체 (로컬 타임존 고정, UTC 변환 버그 방지)
function parseDateStr(str: string) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export default function DateRangeCalendar({
  startDate,
  endDate,
  onChange,
}: Props) {
  const today = getTodayParts();
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // 클릭 흐름 제어: start/end가 둘 다 확정되면 다음 클릭은 "새 시작"으로 리셋
  const [isRangeComplete, setIsRangeComplete] = useState(true);

  const generateDays = () => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    const lastDay = new Date(viewYear, viewMonth, 0);
    const totalDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: { day: number; dateStr: string }[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: 0, dateStr: "" }); // 빈 칸
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, dateStr: toDateStr(viewYear, viewMonth, i) });
    }
    return days;
  };

  const days = generateDays();

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

  const handleDayClick = (dateStr: string) => {
    if (!dateStr) return;

    if (isRangeComplete) {
      // 새로운 range 시작
      onChange(dateStr, dateStr);
      setIsRangeComplete(false);
    } else {
      // 두 번째 클릭: start보다 이전이면 새 start로, 이후면 end로 확정
      if (parseDateStr(dateStr) < parseDateStr(startDate)) {
        onChange(dateStr, startDate);
      } else {
        onChange(startDate, dateStr);
      }
      setIsRangeComplete(true);
    }
  };

  // 날짜 칸의 상태(시작/종료/범위내/오늘) 판별
  const getDayState = (dateStr: string) => {
    if (!dateStr)
      return { isStart: false, isEnd: false, inRange: false, isToday: false };

    const d = parseDateStr(dateStr);
    const s = parseDateStr(startDate);
    const e = parseDateStr(
      isRangeComplete ? endDate : (hoverDate ?? startDate),
    );

    const rangeStart = s <= e ? s : e;
    const rangeEnd = s <= e ? e : s;

    return {
      isStart: dateStr === startDate,
      isEnd: isRangeComplete
        ? dateStr === endDate
        : dateStr === (hoverDate ?? startDate),
      inRange: d >= rangeStart && d <= rangeEnd,
      isToday: dateStr === toDateStr(today.year, today.month, today.day),
    };
  };

  const handleStartInputChange = (value: string) => {
    if (parseDateStr(value) > parseDateStr(endDate)) {
      onChange(value, value);
    } else {
      onChange(value, endDate);
    }
  };

  const handleEndInputChange = (value: string) => {
    if (parseDateStr(value) < parseDateStr(startDate)) {
      onChange(value, value);
    } else {
      onChange(startDate, value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 캘린더 그리드 (전체 너비) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="px-2 py-1 text-slate-400 hover:text-slate-700 text-sm font-bold"
          >
            &lt;
          </button>
          <span className="text-sm font-bold text-slate-700">
            {viewYear}년 {viewMonth}월
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="px-2 py-1 text-slate-400 hover:text-slate-700 text-sm font-bold"
          >
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
          {weekdays.map((wd, i) => (
            <div
              key={i}
              className={
                wd === "일"
                  ? "text-red-400"
                  : wd === "토"
                    ? "text-indigo-400"
                    : ""
              }
            >
              {wd}
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-7 gap-y-1.5"
          onMouseLeave={() => setHoverDate(null)}
        >
          {days.map((item, idx) => {
            if (!item.dateStr) return <div key={idx} />;
            const state = getDayState(item.dateStr);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDayClick(item.dateStr)}
                onMouseEnter={() =>
                  !isRangeComplete && setHoverDate(item.dateStr)
                }
                className={`relative h-9 text-xs font-medium transition-colors
              ${state.inRange ? "bg-indigo-50" : ""}
              ${state.isStart ? "rounded-l-full" : ""}
              ${state.isEnd ? "rounded-r-full" : ""}
            `}
              >
                <span
                  className={`w-9 h-9 flex items-center justify-center rounded-full mx-auto
                ${state.isStart || state.isEnd ? "bg-indigo-600 text-white" : "text-slate-700"}
                ${state.isToday && !state.isStart && !state.isEnd ? "border border-indigo-400" : ""}
              `}
                >
                  {item.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 시작일/종료일 인풋 (캘린더 아래, 가로 배치) */}
      <div className="flex gap-3 pt-3 border-t border-slate-100">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500">시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartInputChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-indigo-400 w-full"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500">종료일</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndInputChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-indigo-400 w-full"
          />
        </div>
      </div>
    </div>
  );
}
