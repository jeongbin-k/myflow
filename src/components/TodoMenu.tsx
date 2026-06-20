import { useState, useEffect, useRef } from "react";
import { useTodos } from "../hooks/useTodos";
import type { Todo } from "../context/TodoContext";
import { IconPencil, IconTrash } from "@tabler/icons-react";

type Props = {
  todo: Todo;
};

export default function TodoMenu({ todo }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setEditingTodo, setIsModalOpen, deleteTodo } = useTodos();

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    setEditingTodo(todo);
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`"${todo.title}"을 삭제하시겠어요?`)) {
      deleteTodo(todo.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation(); // 부모 row의 토글 클릭 막기
          setIsOpen((prev) => !prev);
        }}
        className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-7 w-32 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20"
        >
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <IconPencil size={16} stroke={2} />
            편집
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-400 transition-colors"
          >
            <IconTrash size={16} stroke={2} />
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
