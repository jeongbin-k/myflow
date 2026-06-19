import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTodos } from "../hooks/useTodos";

// 나중에 Supabase에서 카테고리별 투두 개수를 그룹핑(COUNT)해서 가져올 가상 데이터
const CATEGORY_CONFIG = {
  건강: { color: "#10b981", bg: "bg-emerald-50 text-emerald-600" },
  공부: { color: "#3b82f6", bg: "bg-blue-50 text-blue-600" },
  업무: { color: "#8b5cf6", bg: "bg-purple-50 text-purple-600" },
  일상: { color: "#f59e0b", bg: "bg-amber-50 text-amber-600" },
};

export default function CategoryAnalysis() {
  // 1. 전역 기지에서 실시간 데이터와 로딩 상태 불러옴
  const { todos, isLoading } = useTodos();

  // 2. 실시간 데이터를 기반으로 카테고리별 비중 계산
  const totalCount = todos.length;

  // 3. 카테고리별로 개수부터 세어줍니다.
  const initialCounts = { 건강: 0, 공부: 0, 업무: 0, 일상: 0 };
  const counts = todos.reduce(
    (acc, todo) => {
      const cat = todo.category;
      if (cat in acc) {
        acc[cat as keyof typeof initialCounts]++;
      }
      return acc;
    },
    { ...initialCounts },
  );

  // Recharts와 우측 범례가 먹을 수 있는 퍼센트(%) 데이터 배열로 변환
  const chartData = Object.keys(CATEGORY_CONFIG).map((name) => {
    const count = counts[name as keyof typeof initialCounts] || 0;
    // 0 나누기 방지 및 정밀한 반올림 퍼센트 계산
    const value = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return {
      name,
      value,
      color: CATEGORY_CONFIG[name as keyof typeof CATEGORY_CONFIG].color,
    };
  });

  // 데이터가 아예 없을 때 차트가 기괴하게 깨지는 걸 막기 위한 검사
  const hasData = totalCount > 0;

  return (
    <div className="w-full h-[280px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 상단 타이틀 영역 */}
      <div className="shrink-0 mb-2">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          카테고리 분석
        </h3>
      </div>

      {/* 로딩 및 데이터 공백 핸들링 */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-slate-400">
          로딩 중...
        </div>
      ) : !hasData ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          분석할 투두 데이터가 없습니다.
        </div>
      ) : (
        // 차트 및 범례(Label) 메인 컨텐츠 영역
        <div className="flex-1 flex items-center justify-between min-h-0">
          {/* 둥근 도넛 차트 구역 (왼쪽) */}
          <div className="w-[45%] h-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50} // 안쪽 구멍 크기 (도넛 형태 만들기)
                  outerRadius={70} // 바깥쪽 반지름
                  paddingAngle={4} // 조각 사이의 간격 수치
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "비중"]}
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "none",
                    fontWeight: "bold",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 카테고리별 퍼센트 범례 구역 (오른쪽) */}
          <div className="w-[50%] flex flex-col gap-2.5">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {/* 색상 커스텀 점 */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {/* 카테고리 이름 배지 */}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${CATEGORY_CONFIG[item.name as keyof typeof CATEGORY_CONFIG].bg}`}
                  >
                    {item.name}
                  </span>
                </div>
                {/* 퍼센트 수치 */}
                <span className="text-xs font-extrabold text-slate-600 tracking-tight">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
