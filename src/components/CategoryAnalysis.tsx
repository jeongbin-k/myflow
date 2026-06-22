import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTodos } from "../hooks/useTodos";
import { getChartColor } from "../constants/chartColors";

export default function CategoryAnalysis() {
  const { todos, categories, isLoading } = useTodos();

  const totalCount = todos.length;

  // 카테고리별 개수 집계 (이제 categories 테이블 기준으로 동적 처리)
  const counts: Record<string, number> = {};
  categories.forEach((cat) => {
    counts[cat.name] = 0;
  });
  todos.forEach((todo) => {
    if (todo.category in counts) {
      counts[todo.category]++;
    }
  });

  // 차트 데이터: categories 배열 순서대로 색상 배정
  const chartData = categories.map((cat, index) => {
    const count = counts[cat.name] || 0;
    const value = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return {
      name: cat.name,
      value,
      color: getChartColor(index).hex,
      bg: getChartColor(index).bg,
    };
  });

  const hasData = totalCount > 0;

  return (
    <div className="w-full h-[280px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="shrink-0 mb-2">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          카테고리 분석
        </h3>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-slate-400">
          로딩 중...
        </div>
      ) : !hasData ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          분석할 투두 데이터가 없습니다.
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between min-h-0">
          <div className="w-[45%] h-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
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

          <div className="w-[50%] flex flex-col gap-2.5">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${item.bg}`}
                  >
                    {item.name}
                  </span>
                </div>
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
