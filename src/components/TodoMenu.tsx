import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTodos } from "../hooks/useTodos";
import type { Todo } from "../context/TodoContext";
import { IconPencil, IconTrash } from "@tabler/icons-react";

type Props = {
  todo: Todo;
};

export default function TodoMenu({ todo }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setEditingTodo, setIsModalOpen, deleteTodo } = useTodos();

  // 메뉴를 열 때, 버튼의 실제 화면 좌표를 계산해서 메뉴 위치를 정함
  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4, // 버튼 바로 아래
        left: rect.right - 128, // 메뉴 너비(w-32=128px)만큼 왼쪽으로 정렬
      });
    }
    setIsOpen((prev) => !prev);
  };

  // 바깥 클릭 시 메뉴 닫기 (버튼과 메뉴 둘 다 감시)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 메뉴 열림에 따라서 전체 페이지 잠금/해제
  useEffect(() => {
    const scrollArea = document.getElementById("dashboard-scroll-area");
    if (!scrollArea || !isOpen) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    scrollArea.addEventListener("wheel", preventScroll, { passive: false });
    scrollArea.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      scrollArea.removeEventListener("wheel", preventScroll);
      scrollArea.removeEventListener("touchmove", preventScroll);
    };
  }, [isOpen]);

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

  // "최종 편집" 표시 로직
  function formatLastEdited(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return `${year}년 ${month}월 ${day}일 ${ampm} ${displayHour}시 ${minutes}분`;
  }
  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggleMenu}
        className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50"
          >
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <IconPencil size={17} stroke={1.75} className="text-slate-400" />
              편집
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-500 transition-colors"
            >
              <IconTrash
                size={17}
                stroke={1.75}
                className="text-slate-400 group-hover:text-red-400"
              />
              삭제
            </button>

            <div className="border-t border-slate-100 mt-1.5 pt-2.5 px-3 pb-1.5">
              <p className="text-xs text-slate-400">최종 편집</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatLastEdited(todo.updated_at)}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
