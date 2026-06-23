import { useTodos } from "../hooks/useTodos";
import { useMemo } from "react";
import TodoMenu from "./TodoMenu";

export default function TodoToday() {
  // 전역 기지에서 데이터와 토글 함수, 로딩 상태를 꺼내온다.
  const { todos, isLoading, toggleTodo } = useTodos();
  // 모달
  const { setIsModalOpen } = useTodos();

  const todayStr = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const todayTodos = todos.filter((todo) => todo.due_date === todayStr);

  // 진행도 계산
  const completedCount = todayTodos.filter((t) => t.is_completed).length;

  return (
    <div className="w-full h-[400px] bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
      {/* 상단 헤더 영역 */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            오늘 할 일
          </h3>
          {/* 총 개수 알림 배지 */}
          <span className="bg-indigo-50 text-indigo-600 text-xs font-extrabold px-2 py-0.5 rounded-full">
            {todayTodos.length}
          </span>
        </div>

        {/* 나중에 실제 입력 모달이나 인풋을 띄울 트리거 버튼 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
        >
          + 할 일 등록
        </button>
      </div>

      {/* 데이터 로딩 중일 때 보일 UI */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-slate-400">
          로딩 중...
        </div>
      ) : todayTodos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          할 일이 없습니다. 새로운 할 일을 추가해 보세요!
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-200">
          {todayTodos.map((todo) => (
            //  바깥 wrapper: 카드 + ⋮ 버튼을 나란히 배치
            <div key={todo.id} className="flex items-center gap-1 group">
              {/* 카드 영역 (기존 호버 박스) */}
              <div
                onClick={() => toggleTodo(todo.id, todo.is_completed)}
                className="flex items-center justify-between flex-1 min-w-0 p-3 rounded-xl border border-slate-50 hover:border-slate-100 bg-slate-50/30 hover:bg-slate-50/70 transition-all cursor-pointer"
              >
                {/* 왼쪽: 체크박스 + 제목 */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      checked={todo.is_completed}
                      readOnly
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
                  ${
                    todo.is_completed
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-slate-200 bg-white group-hover:border-indigo-300"
                  }`}
                    >
                      {todo.is_completed && (
                        <svg
                          className="w-3 h-3 fill-none stroke-current stroke-[3]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-sm font-medium truncate transition-all duration-200
                ${todo.is_completed ? "text-slate-400 font-normal" : "text-slate-700"}`}
                  >
                    {todo.title}
                  </span>
                </div>

                {/* 오른쪽: 카테고리 배지만 (메뉴는 카드 밖으로 뺐음) */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded shrink-0 bg-slate-100 text-slate-500">
                  {todo.category}
                </span>
              </div>

              {/* 카드 바깥, 별도 공간의 ⋮ 메뉴 */}
              <TodoMenu todo={todo} />
            </div>
          ))}
        </div>
      )}

      {/* 하단 미니 브리핑 바 (디테일 마감) */}
      <div className="mt-4 pt-3 border-t border-slate-50 text-xs font-semibold text-slate-400 flex justify-between items-center shrink-0">
        <span>오늘 할 일 진행도</span>
        <span className="text-indigo-600 font-extrabold">
          {completedCount} / {todayTodos.length} 완료
        </span>
      </div>
    </div>
  );
}
