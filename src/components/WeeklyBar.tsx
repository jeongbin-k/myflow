import { useState, useEffect } from "react";
import { useTodos } from "../hooks/useTodos";

export default function WeeklyBarChart() {
  // 1. 전역 기지에서 진짜 데이터와 로딩 상태를 확보합니다.
  const { todos, isLoading } = useTodos();

  // 애니메이션용 상태
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsAnimate(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // 2. 이번 주(월~일) 날짜 범위 구하기 및 요일별 데이터 가공
  const getWeeklyData = () => {
    const labels = ["월", "화", "수", "목", "금", "토", "일"];

    // 기본 뼈대 데이터 세팅 (0%로 초기화)
    const stats = labels.map((label) => ({ label, total: 0, completed: 0 }));

    const now = new Date();
    const currentDay = now.getDay(); // 0: 일, 1: 월, ..., 6: 토

    // 이번 주 월요일 날짜 구하기
    const startOfWeek = new Date(now);
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // 이번 주 일요일 날짜 구하기
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // 이번 주에 해당하는 투두만 돌면서 요일별 매칭
    todos.forEach((todo) => {
      // Supabase UTC 타임존과 KST(한국) 간의 9시간 시차 보정
      const utcDate = new Date(todo.created_at);
      const kstTime = utcDate.getTime() + 9 * 60 * 60 * 1000;
      const todoDate = new Date(kstTime);

      // 이번 주 범위 내에 있는 투두만 집계
      if (todoDate >= startOfWeek && todoDate <= endOfWeek) {
        // ESLint 경고 해결: 재할당 안 하므로 const 사용
        const dayIdx = todoDate.getUTCDay();

        // 우리 배열 순서(월~일)에 맞게 인덱스 보정 (일요일 0 -> 인덱스 6으로)
        const adjustedIdx = dayIdx === 0 ? 6 : dayIdx - 1;

        stats[adjustedIdx].total++;
        if (todo.is_completed) {
          stats[adjustedIdx].completed++;
        }
      }
    });

    // 최종 UI용 퍼센트 배열로 변환
    return stats.map((item) => {
      const percentage =
        item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
      return {
        label: item.label,
        percentage,
      };
    });
  };

  const weeklyData = getWeeklyData();

  // 이번 주 평균 달성률 계산
  const totalPercentage = weeklyData.reduce(
    (acc, cur) => acc + cur.percentage,
    0,
  );
  const averagePercentage = Math.round(totalPercentage / weeklyData.length);

  return (
    <div className="w-full h-[440px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 🔝 상단 타이틀 및 평균 브리핑 영역 */}
      <div className="w-full shrink-0 flex flex-col gap-1 text-left">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          이번 주 달성률
        </h3>
        {isLoading ? (
          <span className="text-xl font-extrabold text-slate-300 mt-1">
            평균 --%
          </span>
        ) : (
          <span className="text-xl font-extrabold text-indigo-600 mt-1">
            평균 {averagePercentage}%
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 w-full flex items-center justify-center text-sm font-bold text-slate-400">
          로딩 중...
        </div>
      ) : (
        /* 막대그래프 메인 영역 (Flex 레이아웃으로 하단 정렬) */
        <div className="flex-1 w-full flex items-end justify-between px-2 pt-10 pb-2 min-h-0">
          {weeklyData.map((item, idx) => {
            // 애니메이션 상태가 참(true)이 되면 제 높이를 찾아가고, 아닐 땐 0%
            const barHeight = isAnimate ? `${item.percentage}%` : "0%";

            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-3 h-full justify-end w-7"
              >
                {/* 막대 기둥 감싸는 영역 */}
                <div
                  style={{ height: barHeight }}
                  className="w-full bg-slate-50/50 rounded-t-lg flex items-end relative transition-all duration-1000 ease-out min-h-[4px]"
                >
                  {/* 항상 막대 머리 위에 일정한 간격으로 뜨는 숫자 */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-slate-700 whitespace-nowrap">
                    {item.percentage}%
                  </div>

                  {/* 실제 채워지는 인디고 바 */}
                  <div
                    className={`w-full h-full rounded-t-lg transition-colors duration-300
                      ${item.percentage >= 50 ? "bg-indigo-500" : "bg-indigo-300"}
                    `}
                  />
                </div>

                {/* 하단 요일 라벨 */}
                <span className="text-xs font-bold text-slate-400 shrink-0">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
