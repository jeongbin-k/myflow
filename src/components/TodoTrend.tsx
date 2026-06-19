import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTodos } from "../hooks/useTodos";

export default function TodoTrend() {
  const { todos, isLoading } = useTodos();
  const [range, setRange] = useState<"7" | "30">("30");

  // 날짜를 "M/D" 형식의 키로 변환하는 헬퍼
  const toDateKey = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

  // range가 바뀌거나 todos가 갱신될 때만 다시 계산
  const chartData = useMemo(() => {
    const days = Number(range);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. 최근 N일치 날짜 배열을 만들고, 각 날짜를 키로 한 카운트 맵 초기화
    const dateList: Date[] = [];
    const countMap = new Map<string, number>();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dateList.push(d);
      countMap.set(toDateKey(d), 0);
    }

    // 2. 완료된 todo들을 날짜별로 집계
    todos.forEach((todo) => {
      if (!todo.is_completed || !todo.completed_at) return;

      const completedDate = new Date(todo.completed_at);
      const key = toDateKey(completedDate);

      // 집계 범위(최근 N일) 안에 있는 날짜만 카운트
      if (countMap.has(key)) {
        countMap.set(key, (countMap.get(key) ?? 0) + 1);
      }
    });

    // 3. Recharts가 먹을 수 있는 배열 형태로 변환
    return dateList.map((d) => ({
      date: toDateKey(d),
      count: countMap.get(toDateKey(d)) ?? 0,
    }));
  }, [todos, range]);

  return (
    <div className="w-full h-[400px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="w-full flex justify-between items-center shrink-0 mb-6">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          할 일 완료 추이
        </h3>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value as "7" | "30")}
          className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors"
        >
          <option value="7">최근 7일</option>
          <option value="30">최근 30일</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-slate-400">
          로딩 중...
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0 text-[10px] font-bold text-slate-400">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                stroke="#94a3b8"
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#94a3b8"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "11px",
                  border: "none",
                  fontWeight: "bold",
                }}
                itemStyle={{ color: "#a5b4fc" }}
                labelFormatter={(label) => `${label}`}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="완료 개수"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
