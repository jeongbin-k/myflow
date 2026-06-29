// src/components/Header.tsx
import { useState, useEffect, useRef } from "react";
import { IconBell, IconChevronDown } from "@tabler/icons-react";

const pageTitles: Record<string, string> = {
  dashboard: "대시보드",
  tasks: "할 일 관리",
  calendar: "캘린더",
};

type Props = {
  currentMenu: string;
};

export default function Header({ currentMenu }: Props) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const title = pageTitles[currentMenu] ?? "";

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
      <h1 className="text-lg font-bold text-slate-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* 알림 종 아이콘 */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            aria-label="알림"
          >
            <IconBell size={25} stroke={1.5} />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-4 px-4 z-50">
              <p className="text-sm text-slate-400 text-center py-4">
                알림이 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-px h-6 bg-slate-100" />

        {/* 프로필 */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-sm shrink-0">
              JB
            </div>
            <span className="text-sm font-semibold text-slate-700">
              Jeong Bin
            </span>
            <IconChevronDown size={14} stroke={2} className="text-slate-700" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                이름 변경
              </button>
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                프로필 이미지 변경
              </button>
              <div className="border-t border-slate-100 my-1.5" />
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
