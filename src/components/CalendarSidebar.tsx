import type { Todo } from "../context/TodoContext";
import { getColorDot } from "../constants/colorPalette";

type Props = {
  dateStr: string | null; // null이면 아무 날짜도 선택 안 된 기본 상태
  todos: Todo[]; // 선택된 날짜에 해당하는 todo 목록 (이미 필터링되어 전달됨)
  onSelectTodo: (todo: Todo) => void;
};

function formatDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${m}월 ${d}일 ${weekdays[date.getDay()]}요일`;
}

export default function CalendarSidebar({
  dateStr,
  todos,
  onSelectTodo,
}: Props) {
  return (
    <div className="w-72 shrink-0 h-full flex flex-col pl-5">
      {/* 헤더 */}
      <div className="mb-4 shrink-0">
        <h3 className="text-base font-bold text-slate-800">
          {dateStr ? formatDateLabel(dateStr) : "날짜를 선택하세요"}
        </h3>
      </div>

      {/* 일정 리스트 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {!dateStr ? (
          <p className="text-sm text-slate-400 mt-4 text-center">
            캘린더에서 날짜를 클릭하면
            <br />
            그날의 일정이 여기 표시됩니다.
          </p>
        ) : todos.length === 0 ? (
          <p className="text-sm text-slate-400 mt-4 text-center">
            일정이 없습니다.
          </p>
        ) : (
          todos.map((todo) => (
            <button
              key={todo.id}
              onClick={() => onSelectTodo(todo)}
              className="flex items-stretch gap-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors text-left p-2.5"
            >
              <span
                className={`w-1 rounded-full shrink-0 ${getColorDot(todo.color)}`}
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className={`text-sm  truncate ${todo.is_completed ? "text-slate-400 line-through" : "text-slate-700"}`}
                >
                  {todo.title}
                </span>
                <span className="text-xs text-slate-400">{todo.category}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
