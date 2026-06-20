import { useState } from "react";
import { useTodos } from "../hooks/useTodos";

const categories = ["건강", "공부", "업무", "일상"] as const;

const categoryStyles: Record<string, string> = {
  건강: "bg-emerald-50 text-emerald-600 border-emerald-200",
  공부: "bg-blue-50 text-blue-600 border-blue-200",
  업무: "bg-purple-50 text-purple-600 border-purple-200",
  일상: "bg-amber-50 text-amber-600 border-amber-200",
};

function getTodayStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddTodoModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    addTodo,
    updateTodo,
    editingTodo,
    setEditingTodo,
  } = useTodos();

  const isEditMode = editingTodo !== null;

  const [title, setTitle] = useState(editingTodo?.title ?? "");
  const [category, setCategory] = useState<string>(
    editingTodo?.category ?? "일상",
  );
  const [dueDate, setDueDate] = useState(
    editingTodo?.due_date ?? getTodayStr(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isModalOpen) return null;

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTodo(null); // 닫을 때 수정 모드 초기화
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && editingTodo) {
        await updateTodo(editingTodo.id, title.trim(), category, dueDate);
      } else {
        await addTodo(title.trim(), category, dueDate);
      }
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-[400px] p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? "할 일 수정" : "새 할 일 추가"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="할 일을 입력하세요"
            autoFocus
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500">카테고리</label>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-all ${
                  category === cat
                    ? categoryStyles[cat]
                    : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500">날짜</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "처리 중..." : isEditMode ? "수정하기" : "추가하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
