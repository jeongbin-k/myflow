import { useState, useEffect, useMemo } from "react";
import { useTodos } from "../hooks/useTodos";
import { isTodoOnDate } from "../utils/todoDateRange";

export default function ProgressDonut() {
  const { todos, isLoading } = useTodos();

  // 오늘 날짜 문자열 (TodoToday와 동일한 로직)
  const todayStr = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // due_date가 오늘인 것만 필터링 추가 (6/29일 isTodoOnDate)
  const todayTodos = useMemo(
    () => todos.filter((todo) => isTodoOnDate(todo, todayStr)),
    [todos, todayStr],
  );

  const totalTasks = todayTodos.length;
  const completedTasks = todayTodos.filter((todo) => todo.is_completed).length;

  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="w-full h-[440px] bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between items-center text-center">
      <div className="w-full text-left shrink-0">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          오늘의 진행률
        </h3>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-slate-400">
          로딩 중...
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center w-full flex-1">
            <svg
              className="w-44 h-44 transform -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-indigo-600 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800">
                {percentage}%
              </span>
              <span className="text-xs font-bold text-slate-400 mt-1">
                완료
              </span>
            </div>
          </div>

          <div className="w-full border-t border-slate-50 pt-4 shrink-0 flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400">오늘 목표</span>
            <span className="text-sm font-extrabold text-slate-700">
              {totalTasks === 0 ? (
                "오늘 등록된 할 일이 없습니다."
              ) : (
                <>
                  {totalTasks}개 중 {completedTasks}개 완료
                </>
              )}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
