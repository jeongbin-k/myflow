import { useTodos } from "../hooks/useTodos";

// 날짜 포맷팅 함수: YYYY-MM-DD 형태에서 MM-DD만 추출하여 반환
function formatDisplayDate(dateStr: string | null): string {
  if (!dateStr) return "";
  // 2026-06-19 -> 06-19
  return dateStr.slice(5);
}

export default function TodoRecent() {
  const { todos, isLoading } = useTodos();

  // 데이터 가공: 완료된 것들만 골라서 완료 시간(completed_at) 기준 최신순 정렬
  const recentTodos = todos
    .filter((todo) => {
      return todo.is_completed && todo.completed_at;
    })
    .sort((a, b) => {
      const timeA = new Date(a.completed_at!).getTime();
      const timeB = new Date(b.completed_at!).getTime();
      return timeB - timeA;
    })
    .slice(0, 6);

  return (
    <div className="w-full h-[400px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 상단 헤더 영역 */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          최근 완료한 일
        </h3>
        <button className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
          전체보기
        </button>
      </div>

      {/* 데이터 로딩/상태 UI */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-slate-400">
          로딩 중...
        </div>
      ) : recentTodos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          최근 완료한 일이 없습니다.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col scrollbar-thin scrollbar-thumb-slate-200">
          {recentTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between py-3.5 border-b border-slate-100 hover:bg-slate-50/40 transition-all group px-1"
            >
              {/* 왼쪽: 체크 아이콘 + 제목 */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-100">
                  <svg
                    className="w-3 h-3 fill-none stroke-white stroke-[3]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600 truncate">
                  {todo.title}
                </span>
              </div>

              {/* 오른쪽: 계획일 기준 완료 날짜 표시 */}
              <span className="text-xs font-bold text-slate-400 shrink-0 tracking-tight">
                {formatDisplayDate(todo.due_date)} 완료
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
