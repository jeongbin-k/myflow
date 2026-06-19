import { useTodos } from "../hooks/useTodos";

// 날짜 포맷팅 함수 (Supabase의 ISO 날짜를 "MM-DD-HH:MM" 형태로 보이게 변환)
function formatCompletedAt(isoString: string | null): string {
  if (!isoString) return "";
  // 타임존 공백 및 찌꺼기 방지를 위해 안전하게 Date 객체 생성
  const date = new Date(isoString);

  // 만약 날짜 변환이 고장났다면 빈 값 처리 (방어 코드)
  if (isNaN(date.getTime())) return "";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}-${day} ${hours}:${minutes}`;
}

export default function TodoRecent() {
  const { todos, isLoading } = useTodos();

  // 데이터 가공: 완료된 것들 ("is_completed: true")만 골라서 최신 완료 순으로 정렬하기
  const recentTodos = todos
    .filter((todo) => {
      // 주입된 데이터가 진짜 존재하고 완료 상태가 참인지 기본 검사
      return todo.is_completed && todo.completed_at;
    })
    .sort((a, b) => {
      // 날짜 변환 에러를 방지하기 위해 확실하게 시간 숫자로 바꿔서 비교
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
        <button className="text-xs font-bold text-indigo-500 hover:text-indigo-700  transition-colors">
          전체보기
        </button>
      </div>

      {/* 데이터 로딩 중일 때 보일 UI */}
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
                {formatCompletedAt(todo.completed_at)}{" "}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
