import { useState } from "react";

// 나중에 Supabase 및 글로벌 상태로 전환될 투두 가상 데이터
interface Todo {
  id: number;
  title: string;
  category: "건강" | "공부" | "업무" | "일상";
  isCompleted: boolean;
}

export default function TodoToday() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: "운동하기", category: "건강", isCompleted: true },
    { id: 2, title: "React 공부 2시간", category: "공부", isCompleted: true },
    { id: 3, title: "정보처리기사 공부", category: "공부", isCompleted: false },
    { id: 4, title: "헬스장", category: "건강", isCompleted: false },
    { id: 5, title: "포트폴리오 수정", category: "업무", isCompleted: false },
    { id: 6, title: "저녁 장보기", category: "일상", isCompleted: false }, // 스크롤 테스트용 추가 데이터
    { id: 7, title: "블로그 글 쓰기", category: "공부", isCompleted: false }, // 스크롤 테스트용 추가 데이터
  ]);

  // 체크박스 토글 함수
  const handleToggle = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );
  };

  // 카테고리별 이쁜 파스텔톤 색상 매칭 맵
  const categoryColors = {
    건강: "bg-emerald-50 text-emerald-600",
    공부: "bg-blue-50 text-blue-600",
    업무: "bg-purple-50 text-purple-600",
    일상: "bg-amber-50 text-amber-600",
  };

  const completedCount = todos.filter((t) => t.isCompleted).length;

  return (
    <div className="w-full h-[400px] bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* 🔝 상단 헤더 영역 */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            오늘 할 일
          </h3>
          {/* 총 개수 알림 배지 */}
          <span className="bg-indigo-50 text-indigo-600 text-xs font-extrabold px-2 py-0.5 rounded-full">
            {todos.length}
          </span>
        </div>

        {/* 나중에 실제 입력 모달이나 인풋을 띄울 트리거 버튼 */}
        <button className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
          + 할 일 추가
        </button>
      </div>

      {/* 고정 높이를 뚫고 아이템이 많아지면 얇고 깔끔하게 스크롤바가 돌도록 세팅 */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-200">
        {todos.map((todo) => (
          <div
            key={todo.id}
            onClick={() => handleToggle(todo.id)}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-slate-100 bg-slate-50/30 hover:bg-slate-50/70 transition-all cursor-pointer group"
          >
            {/* 왼쪽: 커스텀 체크박스 + 투두 내용 */}
            <div className="flex items-center gap-3 min-w-0">
              {/* 🔮 시안 이미지와 똑같은 완벽한 동그라미 보라색 체크박스 */}
              <div className="relative flex items-center justify-center shrink-0">
                {/* 실제 스크린 리더 인식 및 데이터 처리를 위한 진짜 input은 숨겨둡니다. */}
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  readOnly
                  className="sr-only"
                />
                {/* 시각적으로 보여질 커스텀 동그라미 디자인 */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
            ${
              todo.isCompleted
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-slate-200 bg-white group-hover:border-indigo-300"
            }`}
                >
                  {/* 체크되었을 때만 화살표(✓) 노출 */}
                  {todo.isCompleted && (
                    <svg
                      className="w-3 h-3 fill-none stroke-current stroke-[3]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              </div>

              {/* 투두 제목 (텍스트 색상 밸런스 조정) */}
              <span
                className={`text-sm font-medium truncate transition-all duration-200
          ${todo.isCompleted ? "text-slate-400 font-normal" : "text-slate-700"}`}
              >
                {todo.title}
              </span>
            </div>

            {/* 오른쪽: 카테고리 뱃지 */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${categoryColors[todo.category]}`}
            >
              {todo.category}
            </span>
          </div>
        ))}
      </div>

      {/* 하단 미니 브리핑 바 (디테일 마감) */}
      <div className="mt-4 pt-3 border-t border-slate-50 text-xs font-semibold text-slate-400 flex justify-between items-center shrink-0">
        <span>오늘 할 일 진행도</span>
        <span className="text-indigo-600 font-extrabold">
          {completedCount} / {todos.length} 완료
        </span>
      </div>
    </div>
  );
}
