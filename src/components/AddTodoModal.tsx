import { useState, useRef, useEffect } from "react";
import { useTodos } from "../hooks/useTodos";
import DateRangeCalendar from "./DateRangeCalendar";
import { COLOR_PALETTE, getColorDot } from "../constants/colorPalette";

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
    categories,
    addCategory,
  } = useTodos();

  const isEditMode = editingTodo !== null;

  const [title, setTitle] = useState(editingTodo?.title ?? "");
  const [category, setCategory] = useState<string>(
    editingTodo?.category ?? "일상",
  );
  const [color, setColor] = useState<string>(editingTodo?.color ?? "blue");
  const [startDate, setStartDate] = useState(
    editingTodo?.due_date ?? getTodayStr(),
  );
  const [endDate, setEndDate] = useState(
    editingTodo?.end_date ?? editingTodo?.due_date ?? getTodayStr(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 색상 팔레트 팝업 상태
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // 카테고리 추가 인풋 상태
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // 팔레트 바깥 클릭하면 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target as Node)
      ) {
        setIsColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isModalOpen) return null;

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    setIsAddingCategory(false);
    setNewCategoryName("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && editingTodo) {
        await updateTodo(
          editingTodo.id,
          title.trim(),
          category,
          startDate,
          endDate,
          color,
        );
      } else {
        await addTodo(title.trim(), category, startDate, endDate, color);
      }
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategorySubmit = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setIsAddingCategory(false);
      return;
    }
    const created = await addCategory(trimmed);
    if (created) {
      setCategory(created.name); // 추가하면서 바로 선택
    }
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-[580px] p-6 flex flex-col gap-5"
      >
        {/* 헤더: 색상 동그라미 + 제목 인풋 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative" ref={colorPickerRef}>
              <button
                type="button"
                onClick={() => setIsColorPickerOpen((prev) => !prev)}
                className={`w-6 h-6 rounded-full ${getColorDot(color)} shrink-0 hover:opacity-80 transition-opacity`}
                aria-label="색상 선택"
              />

              {isColorPickerOpen && (
                <div className="absolute top-8 left-0 z-10 bg-white border border-slate-200 rounded-xl shadow-lg p-3 grid grid-cols-4 gap-2 w-[160px]">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => {
                        setColor(c.key);
                        setIsColorPickerOpen(false);
                      }}
                      className="relative w-7 h-7 rounded-full flex items-center justify-center"
                    >
                      <span className={`w-7 h-7 rounded-full ${c.dot}`} />
                      {color === c.key && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="할 일 제목"
              autoFocus
              className="flex-1 text-base font-semibold text-slate-800 outline-none placeholder:text-slate-300 placeholder:font-normal"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none ml-2"
          >
            ×
          </button>
        </div>

        <div className="border-t border-slate-100" />

        {/* 기간 선택 캘린더 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500">기간</label>
          <DateRangeCalendar
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => {
              setStartDate(s);
              setEndDate(e);
            }}
          />
        </div>

        {/* 카테고리 칩 영역 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500">카테고리</label>
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  category === cat.name
                    ? "bg-indigo-50 text-indigo-600 border-indigo-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}

            {isAddingCategory ? (
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCategorySubmit();
                  if (e.key === "Escape") {
                    setIsAddingCategory(false);
                    setNewCategoryName("");
                  }
                }}
                onBlur={handleAddCategorySubmit}
                placeholder="카테고리명"
                autoFocus
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-300 outline-none w-24"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
              >
                + 추가
              </button>
            )}
          </div>
        </div>

        {/* 하단: 선택 기간 + 버튼 */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 whitespace-nowrap">
            📅 {startDate === endDate ? startDate : `${startDate} ~ ${endDate}`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? "처리 중..."
                : isEditMode
                  ? "수정하기"
                  : "추가하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
