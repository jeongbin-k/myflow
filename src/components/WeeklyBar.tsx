import { useState, useEffect } from "react";
import { useTodos } from "../hooks/useTodos";

export default function WeeklyBarChart() {
  // 1. 전역 기지에서 데이터와 로딩 상태를 확보
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

  // 2. 이번 주(월~일) 날짜 범위 구하기 및 요일별/주간 총합 데이터 가공
  const getWeeklyStats = () => {
    const labels = ["월", "화", "수", "목", "금", "토", "일"];

    // 기본 요일별 뼈대 데이터 세팅 (0%로 초기화)
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

    // 주간 누적 계산을 위한 카운터 변수
    let totalTasks = 0;
    let completedTasks = 0;

    // 이번 주에 해당하는 투두만 돌면서 요일별 및 전체 누적 매칭
    todos.forEach((todo) => {
      const todoDateStr = todo.due_date || todo.completed_at;
      if (!todoDateStr) return; // return을 먼저 체크하는 줄로 옮김 (순서 중요)

      // "YYYY-MM-DD" 앞 10글자만 잘라서, 로컬 타임존 기준으로 직접 Date 생성
      const [year, month, day] = todoDateStr
        .slice(0, 10)
        .split("-")
        .map(Number);
      const todoDate = new Date(year, month - 1, day);

      if (todoDate >= startOfWeek && todoDate <= endOfWeek) {
        const dayIdx = todoDate.getDay(); // getUTCDay() → getDay()로 변경
        const adjustedIdx = dayIdx === 0 ? 6 : dayIdx - 1;

        stats[adjustedIdx].total++;
        if (todo.is_completed) {
          stats[adjustedIdx].completed++;
        }

        totalTasks++;
        if (todo.is_completed) {
          completedTasks++;
        }
      }
    });

    // 요일별 UI용 퍼센트 배열로 변환
    const weeklyData = stats.map((item) => {
      const percentage =
        item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
      return {
        label: item.label,
        percentage,
      };
    });

    // 2안 반영: 이번 주 총 완료 개수 / 총 등록 개수로 진짜 주간 평균 달성률 산출
    const averagePercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { weeklyData, averagePercentage };
  };

  // 가공된 데이터 해체 할당
  const { weeklyData, averagePercentage } = getWeeklyStats();

  return (
    <div className="w-full h-[440px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 상단 타이틀 및 평균 브리핑 영역 */}
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
