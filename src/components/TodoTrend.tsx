import { useState } from "react";
//  차트 구현을 위해 Recharts 라이브러리 컴포넌트들을 가져옵니다.
// (만약 설치 전이라면 terminal에 npm i recharts 하시면 됩니다!)
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function TodoTrend() {
  //7일 / 30일 필터 상태 관리
  const [range, setRange] = useState<"7" | "30">("30");

  //나중에 Supabase에서 날짜별 그룹핑(COUNT)으로 긁어올 가상 데이터
  const mockData7Days = [
    { date: "6/11", count: 3 },
    { date: "6/12", count: 5 },
    { date: "6/13", count: 2 },
    { date: "6/14", count: 7 },
    { date: "6/15", count: 4 },
    { date: "6/16", count: 6 },
    { date: "6/17", count: 8 },
  ];

  const mockData30Days = [
    { date: "5/19", count: 1 },
    { date: "5/24", count: 4 },
    { date: "5/29", count: 3 },
    { date: "6/3", count: 6 },
    { date: "6/8", count: 4 },
    { date: "6/13", count: 7 },
    { date: "6/18", count: 9 },
  ];

  // 필터 선택에 따라 뿜어줄 데이터 스위칭
  const currentData = range === "7" ? mockData7Days : mockData30Days;

  return (
    <div className="w-full h-[400px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 🔝 상단 타이틀 및 필터 영역 */}
      <div className="w-full flex justify-between items-center shrink-0 mb-6">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          할 일 완료 추이
        </h3>

        {/* 7일/30일 셀렉트 박스 */}
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as "7" | "30")}
          className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors"
        >
          <option value="7">최근 7일</option>
          <option value="30">최근 30일</option>
        </select>
      </div>

      {/* 꺾은선 그래프 메인 영역 */}
      {/* Recharts의 ResponsiveContainer를 쓰면 부모 박스 크기에 맞춰 차트가 알아서 리사이징됩니다. */}
      <div className="flex-1 w-full min-h-0 text-[10px] font-bold text-slate-400">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            {/* 배경 모눈종이 격자 선 (세로선은 빼고 가로선만 연하게 부각) */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            {/* X축: 날짜 */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              dy={10}
            />

            {/* Y축: 완료 개수 */}
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              domain={[0, 10]}
              tickCount={6}
            />

            {/*  마우스 오버 시 나타나는 커스텀 툴팁 */}
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
              labelFormatter={(label) => `${label}일`}
            />

            {/* 시안 감성의 은은한 보라색 그라데이션 선 차트 */}
            <Area
              type="monotone"
              dataKey="count"
              name="완료 개수"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCount)"
            />

            {/* 그라데이션 정의 구역 */}
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
