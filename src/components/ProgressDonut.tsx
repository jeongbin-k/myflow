import { useState, useEffect } from "react";
import { useTodos } from "../hooks/useTodos";

export default function ProgressDonut() {
  // 1. 전역 기지에서 데이터와 로딩 상태를 꺼내옴
  const { todos, isLoading } = useTodos();

  // 2. 실시간 투두 데이터를 기반으로 목표 및 완료 개수 계산
  const totalTasks = todos.length;
  const completedTasks = todos.filter((todo) => todo.is_completed).length;

  // 진행률 계산 공식
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 애니메이션용 상태 (0에서 시작)
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  // SVG 원형 차트를 그리기 위한 세팅
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // 진행률 퍼센트만큼 원의 테두리를 채우는 계산
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="w-full h-[440px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
      {/* 타이틀 영역 */}
      <div className="w-full text-left shrink-0">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          오늘의 진행률
        </h3>
      </div>

      {/* 데이터 로딩 중일 때와 데이터가 없을 때의 UI 대응 */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-slate-400">
          로딩 중...
        </div>
      ) : (
        <>
          {/* 중앙 도넛 차트 영역 */}
          <div className="relative flex items-center justify-center w-full flex-1">
            <svg
              className="w-44 h-44 transform -rotate-90" // 12시 방향부터 차오르도록 -90도 회전
              viewBox="0 0 120 120"
            >
              {/* 배경이 되는 회색 가이드 원 */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              {/* 실제 진행률만큼 차오르는 인디고 컬러 원 */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-indigo-600 transition-all duration-1000 ease-out" // 게이지가 스윽 차오르는 애니메이션
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" // 테두리 끝 모양을 둥글게 가공 (토스/노션 스타일)
                fill="transparent"
              />
            </svg>

            {/* 텍스트 컴포넌트 오버레이 (정중앙 정렬) */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800">
                {percentage}%
              </span>
              <span className="text-xs font-bold text-slate-400 mt-1">
                완료
              </span>
            </div>
          </div>

          {/* 하단 목표 개수 브리핑 영역 */}
          <div className="w-full border-t border-slate-50 pt-4 shrink-0 flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400">오늘 목표</span>
            <span className="text-sm font-extrabold text-slate-700">
              {totalTasks === 0 ? (
                "등록된 할 일이 없습니다."
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
