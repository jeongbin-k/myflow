import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function CategoryAnalysis() {
  // 나중에 Supabase에서 카테고리별 투두 개수를 그룹핑(COUNT)해서 가져올 가상 데이터
  const data = [
    { name: "건강", value: 40, color: "#10b981" }, // emerald-500
    { name: "공부", value: 35, color: "#3b82f6" }, // blue-500
    { name: "업무", value: 15, color: "#8b5cf6" }, // purple-500
    { name: "일상", value: 10, color: "#f59e0b" }, // amber-500
  ];

  // 텍스트 배지용 연한 배경색 맵 (TodoToday와 싱크 매칭)
  const bgColors = {
    건강: "bg-emerald-50 text-emerald-600",
    공부: "bg-blue-50 text-blue-600",
    업무: "bg-purple-50 text-purple-600",
    일상: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="w-full h-[280px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 상단 타이틀 영역 */}
      <div className="shrink-0 mb-2">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          카테고리 분석
        </h3>
      </div>

      {/*  차트 및 범례(Label) 메인 컨텐츠 영역 */}
      <div className="flex-1 flex items-center justify-between min-h-0">
        {/* 둥근 도넛 차트 구역 (왼쪽) */}
        <div className="w-[45%] h-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50} // 안쪽 구멍 크기 (도넛 형태 만들기)
                outerRadius={70} // 바깥쪽 반지름
                paddingAngle={4} // 조각 사이의 간격 수치
                dataKey="value"
              >
                {data.map((entry, index) => (
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
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* 색상 커스텀 점 */}
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {/* 카테고리 이름 배지 */}
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${bgColors[item.name as keyof typeof bgColors]}`}
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
    </div>
  );
}
