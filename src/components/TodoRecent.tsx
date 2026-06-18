import { useState } from "react";

interface RecentTodo {
  id: number;
  title: string;
  completedAt: string; // 나중에 DB의 completed_at 타임스탬프와 매칭될 자리
}

export default function TodoRecent() {
  // 📂 나중에 Supabase에서 "is_completed: true인 것들을 완료 시간 역순으로 정렬"해서 가져올 가상 데이터
  const [recentTodos] = useState<RecentTodo[]>([
    { id: 1, title: "운동하기", completedAt: "오늘 07:30" },
    { id: 2, title: "React 강의 듣기", completedAt: "오늘 06:12" },
    { id: 3, title: "블로그 글 작성", completedAt: "어제 23:15" },
    { id: 4, title: "프로젝트 기획 회의", completedAt: "어제 16:45" },
    { id: 5, title: "책 30분 읽기", completedAt: "어제 12:20" },
    { id: 6, title: "운동하기", completedAt: "그제 15:10" },
  ]);

  return (
    <div className="w-full h-[400px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 🔝 상단 헤더 영역 */}
      {/* 🔝 상단 헤더 영역 */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          최근 완료한 일
        </h3>
        <button className="text-xs font-bold text-indigo-500 hover:text-indigo-700  transition-colors">
          전체보기
        </button>
      </div>

      {/* 📜 공책 메모장 라인 스타일의 리스트 영역 */}
      {/* 패딩과 아이템 높이를 조절하여 실제 줄노트 같은 규칙적인 선을 연출합니다. */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col scrollbar-thin scrollbar-thumb-slate-200">
        {recentTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between py-3.5 border-b border-slate-100 hover:bg-slate-50/40 transition-all group px-1"
          >
            {/* 왼쪽: 채워진 체크박스 + 완료된 투두 제목 */}
            <div className="flex items-center gap-3 min-w-0">
              {/* 완료 원형 체크 아이콘 */}
              <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-100">
                <svg
                  className="w-3 h-3 fill-none stroke-white stroke-[3]"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              {/* 완료된 일 텍스트 */}
              <span className="text-sm font-medium text-slate-600 truncate">
                {todo.title}
              </span>
            </div>

            {/* 오른쪽: 완료 시간 타임라인 */}
            <span className="text-xs font-bold text-slate-400 shrink-0 tracking-tight">
              {todo.completedAt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
