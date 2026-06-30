import { useState, useEffect, useRef } from "react";
import {
  IconBell,
  IconChevronDown,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import ProfileEditModal from "./ProfileEditModal";

const pageTitles: Record<string, string> = {
  dashboard: "대시보드",
  tasks: "할 일 관리",
  calendar: "캘린더",
};

type Props = {
  currentMenu: string;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function Header({ currentMenu }: Props) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { notifications, unseenCount, markAllAsSeen } = useNotifications();
  const { session } = useAuth();
  const user = session?.user;

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "사용자";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initial = displayName.slice(0, 1).toUpperCase();

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

  const handleToggleNotif = () => {
    setIsNotifOpen((prev) => {
      const next = !prev;
      if (next) {
        // 드롭다운을 여는 순간 전부 읽음 처리
        markAllAsSeen();
      }
      return next;
    });
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await supabase.auth.signOut();
  };

  // 최신순 정렬 (triggeredAt 내림차순)
  const sortedNotifications = [...notifications].sort(
    (a, b) =>
      new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime(),
  );

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
      <h1 className="text-lg font-bold text-slate-900">{title}</h1>

      <div className="flex items-center gap-3">
        {/* 알림 종 아이콘 */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleToggleNotif}
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            aria-label="알림"
          >
            <IconBell size={25} stroke={1.5} />
            {unseenCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unseenCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
              {sortedNotifications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">
                  알림이 없습니다.
                </p>
              ) : (
                sortedNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 border-b border-slate-50 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-indigo-500">
                        {n.slot === "morning" && "오전 알림"}
                        {n.slot === "midday" && "오후 알림"}
                        {n.slot === "evening" && "마감 알림"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatTime(n.triggeredAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-snug">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
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
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-sm shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <IconChevronDown size={14} stroke={2} className="text-slate-900" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {/* 사용자 정보 영역 */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>

              {/* 메뉴 영역 */}
              <div className="p-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <IconUser size={16} /> 프로필 변경
                </button>
              </div>

              {/* 로그아웃 영역 */}
              <div className="p-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <IconLogout size={16} /> 로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isProfileModalOpen && (
        <ProfileEditModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </header>
  );
}
