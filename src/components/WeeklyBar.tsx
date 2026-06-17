import { useState, useEffect } from "react";

export default function WeeklyBarChart() {
  // 나중에 Supabase 데이터와 연결될 주간 요일별 완료율 가상 데이터 (월~일 순서 고정)
  const weeklyData = [
    { label: "월", percentage: 80 },
    { label: "화", percentage: 40 },
    { label: "수", percentage: 30 },
    { label: "목", percentage: 70 },
    { label: "금", percentage: 100 },
    { label: "토", percentage: 60 },
    { label: "일", percentage: 0 },
  ];

  // 이번 주 평균 달성률 자동 계산 로직
  const totalPercentage = weeklyData.reduce(
    (acc, cur) => acc + cur.percentage,
    0,
  );
  const averagePercentage = Math.round(totalPercentage / weeklyData.length);

  // 애니메이션용 상태 (처음엔 0% 높이로 대기)
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[440px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 🔝 상단 타이틀 및 평균 브리핑 영역 */}
      <div className="w-full shrink-0 flex flex-col gap-1 text-left">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          이번 주 달성률
        </h3>
        <span className="text-xl font-extrabold text-indigo-600 mt-1">
          평균 {averagePercentage}%
        </span>
      </div>

      {/* 막대그래프 메인 영역 (Flex 레이아웃으로 하단 정렬) */}
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
              {/*여기에 h-[full] 대신 실제 늘어나는 높이(barHeight)와 relative를 줍니다.*/}
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
    </div>
  );
}
