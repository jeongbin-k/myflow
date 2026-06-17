import { useState } from "react";

type Props = {
  onNavigate: (menu: string) => void;
};

// 하드코딩 이벤트 데이터 (나중에 Supabase로 교체할 자리)
const mockEvents: Record<string, { title: string; color: string }[]> = {
  "2026-6-3": [
    {
      title: "요가 수업",
      color: "text-indigo-600 bg-indigo-50 px-1 rounded-sm truncate",
    },
  ],
  "2026-6-5": [
    {
      title: "React 공부",
      color: " text-blue-600 bg-blue-50 px-1 rounded-sm truncate",
    },
  ],
  "2026-6-10": [
    {
      title: "프로젝트 미팅",
      color: " text-red-600 bg-red-50 px-1 rounded-sm truncate",
    },
    {
      title: "팀 점심",
      color: " text-green-600 bg-green-50 px-1 rounded-sm truncate",
    },
    {
      title: "코드 리뷰",
      color: " text-indigo-600 bg-indigo-50 px-1 rounded-sm truncate",
    },
  ],
  "2026-6-15": [
    {
      title: "운동하기",
      color: " text-green-600 bg-green-50 px-1 rounded-sm truncate",
    },
  ],
  "2026-6-18": [
    {
      title: "병원 예약",
      color: " text-red-600 bg-red-50 px-1 rounded-sm truncate",
    },
    {
      title: "친구 만남",
      color: " text-blue-600 bg-blue-50 px-1 rounded-sm truncate",
    },
  ],
  "2026-6-22": [
    {
      title: "독서",
      color: " text-indigo-600 bg-indigo-50 px-1 rounded-sm truncate",
    },
  ],
  "2026-6-25": [
    {
      title: "블로그 작성",
      color: " text-blue-600 bg-blue-50 px-1 rounded-sm truncate",
    },
  ],
  "2026-6-27": [
    {
      title: "쇼핑하기",
      color: "text-green-600 bg-green-50 px-1 rounded-sm truncate",
    },
  ],
};

export default function MainCalendar({ onNavigate }: Props) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6);
  const [viewType, setViewType] = useState("monthly");

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

    const totalDays = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const daysArray = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push({ type: "prev", day: "" });
    }
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push({ type: "current", day: i });
    }

    if (viewType === "weekly") {
      const todayIdx = daysArray.findIndex(
        (item) => item.type === "current" && item.day === 18,
      );
      const startOfWeekIdx = Math.floor(todayIdx / 7) * 7;
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

  return (
    <div className="w-full h-[440px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 상단 헤더 */}
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
              onClick={() => {
                setCurrentYear(2026);
                setCurrentMonth(6);
              }}
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

      {/* 달력 격자판 */}
      <div className="flex-1 flex flex-col justify-between">
        {/* 요일 헤더 */}
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

        {/* 날짜 판 */}
        <div className="grid grid-cols-7 flex-1 pt-1">
          {calendarDays.map((item, idx) => {
            const isSunday = idx % 7 === 0;
            const isSaturday = idx % 7 === 6;
            const isToday =
              item.day === 18 && currentMonth === 6 && currentYear === 2026;

            // 이 날짜의 이벤트 가져오기
            const eventKey = `${currentYear}-${currentMonth}-${item.day}`;
            const events =
              item.type === "current" ? (mockEvents[eventKey] ?? []) : [];

            // 월간,주간에 따라 노출 개수 동적 조절
            const maxVisibleEvents = viewType == "weekly" ? 10 : 1;
            const visibleEvents = events.slice(0, maxVisibleEvents);
            const hiddenCount = Math.max(0, events.length - maxVisibleEvents);

            return (
              <div
                key={idx}
                className="border-b border-r border-slate-100 p-1 flex flex-col items-start min-h-[50px]"
              >
                {/* 날짜 숫자 */}
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

                {/* 이벤트 영역 */}
                <div className="w-full mt-1 flex flex-col gap-0.5">
                  {/* 1개만 표시 */}
                  {visibleEvents.map((event, i) => (
                    <div
                      key={i}
                      className={`text-[9px] font-bold px-1 rounded-sm truncate ${event.color}`}
                    >
                      ● {event.title}
                    </div>
                  ))}

                  {/* +N 더보기 버튼 */}
                  {hiddenCount > 0 && (
                    <button
                      onClick={() => onNavigate("calendar")}
                      className="text-[9px] text-indigo-400 hover:text-indigo-600 text-left transition-colors"
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
