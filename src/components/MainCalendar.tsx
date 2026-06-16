import { useState } from "react";

export default function MainCalendar() {
  // 1. 현재 사용자가 보고 있는 달력의 연도와 월 상태 관리
  // (기준을 2026년 6월로 설정하여 시안 이미지와 똑같이 시작합니다)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 1월 ~ 12월

  // 2. 요일 헤더 데이터
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 🧠 [핵심 달력 알고리즘] 이번 달의 날짜들을 계산하는 함수
  const generateCalendarDays = () => {
    // 자바스크립트 Date 객체는 월이 0부터 시작하므로 (Month - 1) 해줍니다.
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0); // 다음 달의 0번째 날 = 이번 달 마지막 날

    const totalDays = lastDayOfMonth.getDate(); // 이번 달 총 일수
    const startDayOfWeek = firstDayOfMonth.getDay(); // 이번 달 1일의 요일 인덱스

    const daysArray = [];

    // 이전 달의 빈칸 채우기 (흐리게 표시하거나 비워둘 공간)
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push({ type: "prev", day: "" });
    }

    // 이번 달의 진짜 날짜들 채우기
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push({ type: "current", day: i });
    }

    return daysArray;
  };

  const calendarDays = generateCalendarDays();

  // 3. 월 이동 핸들러
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
    <div className="w-full h-[420px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 🔝 상단 헤더 영역 (연도, 월, 이동 버튼) */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            {currentYear}년 {currentMonth}월
          </h2>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <button
              onClick={handlePrevMonth}
              className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 text-sm font-semibold  transition-all"
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
              className="px-3 py-1 text-xs text-slate-600 border-x border-slate-200  font-medium "
            >
              오늘
            </button>
          </div>
        </div>

        {/* 월간 보기 필터 (디자인용 껍데기) */}
        <div className="text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
          월간 보기
        </div>
      </div>

      {/* 📅 달력 격자판 영역 */}
      <div className="flex-1 flex flex-col justify-between">
        {/* 요일 행 (7열 고정) */}
        <div className="grid grid-cols-7 text-center border-b border-slate-100 pb-2 text-xs font-semibold text-slate-400 tracking-wider">
          {weekdays.map((day, idx) => (
            <div
              key={idx}
              className={`${day === "일" ? "text-red-400" : day === "토" ? "text-indigo-400" : ""}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 판 (7열 그리드로 자동 줄바꿈) */}
        <div className="grid grid-cols-7 flex-1 pt-1">
          {calendarDays.map((item, idx) => {
            // 주말 색상 처리를 위한 인덱스 계산
            const isSunday = idx % 7 === 0;
            const isSaturday = idx % 7 === 6;

            return (
              <div
                key={idx}
                className="border-b border-r border-slate-50 p-1 flex flex-col justify-between items-start group min-h-[50px]"
              >
                {/* 날짜 숫자 표시 */}
                <span
                  className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full
                    ${item.type === "prev" ? "text-transparent" : "text-slate-700"}
                    ${item.type === "current" && isSunday ? "text-red-500" : ""}
                    ${item.type === "current" && isSaturday ? "text-indigo-500" : ""}
                    ${item.day === 18 && currentMonth === 6 && currentYear === 2026 ? "bg-indigo-600 text-white!" : ""} 
                  `}
                >
                  {item.day}
                </span>

                {/*  여기가 나중에 스티커/배지(할 일 목록)가 들어갈 컴포넌트 자리 */}
                <div className="w-full mt-1 min-h-[16px] flex flex-col gap-0.5">
                  {item.day === 18 &&
                    currentMonth === 6 &&
                    currentYear === 2026 && (
                      <div className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded-sm truncate">
                        ● 병원 예약
                      </div>
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
