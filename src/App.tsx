// 월간 캘린더
import MainCalendar from "./components/MainCalendar";
// 오늘 진행률 차트 (연동 완료)
import ProgressDonut from "./components/ProgressDonut";
// 주간 달성률 막대 차트 (연동 완료)
import WeeklyBar from "./components/WeeklyBar";
// 오늘 할 일 목록 (연동 완료)
import TodoToday from "./components/TodoToday";
// 할 일 완료 추이 (연동 완료)
import TodoTrend from "./components/TodoTrend";
// 최근 완료한 일 (연동 완료)
import TodoRecent from "./components/TodoRecent";
// 카테고리 분석 (연동 완료)
import CategoryAnalysis from "./components/CategoryAnalysis";
// 명언
import Quotes from "./components/Quotes";
// 할 일 추가/등록 컴포넌트
import AddTodoModal from "./components/AddTodoModal";
// 캘린더 페이지
import CalendarPage from "./pages/CalendarPage";
// 할 일 관리 페이지
import TodoManagePage from "./pages/TodoMangePage";
// 공통 헤더
import Header from "./components/Header";

import { useTodos } from "./hooks/useTodos";
import myflow from "./assets/images/myflow.png";
import { useState } from "react";
import {
  IconLayoutDashboard,
  IconCheckbox,
  IconCalendar,
  IconArrowBarToLeft,
  IconArrowBarToRight,
} from "@tabler/icons-react";
// 로그인 관련
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";

// 메뉴관리
const menus = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <IconLayoutDashboard stroke={2} size={20} />,
  },
  { id: "tasks", label: "할 일 관리", icon: <IconCheckbox size={20} /> },
  { id: "calendar", label: "캘린더", icon: <IconCalendar size={20} /> },
];

export default function App() {
  const { session, isAuthLoading } = useAuth(); // ← 이걸로 교체

  const [currentMenu, setCurrentMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isModalOpen } = useTodos();

  if (isAuthLoading) {
    return <div>로딩 중</div>;
  }

  if (!session) {
    return <LoginPage />;
  }
  // ── 로그인 세션 관리 끝 ──

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* 모달 */}
      {isModalOpen && <AddTodoModal />}
      {/* 2. 좌측 사이드바 영역 */}
      <aside
        className={`h-full bg-white border-r border-slate-100 flex flex-col justify-between p-4 shrink-0 relative transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* 접기/펼치기 토글 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-4.5 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500 hover:text-slate-800 hover:shadow-sm cursor-pointer z-50 transition-all"
        >
          {isSidebarOpen ? (
            <IconArrowBarToLeft stroke={1.5} size={17} />
          ) : (
            <IconArrowBarToRight stroke={1.5} size={17} />
          )}
        </button>

        <div>
          {/* 로고 영역 (닫혔을 때는 글자 숨김) */}
          <div
            className={`flex items-center gap-2 mb-8 px-2 ${isSidebarOpen ? "" : "justify-center"}`}
          >
            <div>
              <img
                src={myflow}
                alt="MyFlow Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold text-slate-800 tracking-tight transition-all duration-200">
                MyFlow
              </span>
            )}
          </div>

          {/* 메뉴 리스트 */}
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setCurrentMenu(menu.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
        ${isSidebarOpen ? "" : "justify-center"}
        ${
          currentMenu === menu.id
            ? "bg-indigo-50 text-indigo-600"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
            >
              {menu.icon}
              {isSidebarOpen && <span>{menu.label}</span>}
            </button>
          ))}
        </div>
      </aside>
      {/* 우측 메인 대시보드 영역 */}
      <div className="flex-1 flex flex-col h-full">
        <Header currentMenu={currentMenu} />
        <main
          id="dashboard-scroll-area"
          className="flex-1 h-full overflow-y-auto p-8 [scrollbar-gutter:stable]"
        >
          {currentMenu === "dashboard" && (
            <>
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  <div className="xl:col-span-7">
                    <MainCalendar onNavigate={setCurrentMenu} />
                  </div>
                  <div className="xl:col-span-2">
                    <ProgressDonut />
                  </div>
                  <div className="xl:col-span-3">
                    <WeeklyBar />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-stretch">
                  <div className="xl:col-span-3">
                    <TodoToday />
                  </div>
                  <div className="xl:col-span-4">
                    <TodoTrend />
                  </div>
                  <div className="xl:col-span-3">
                    <TodoRecent onNavigate={setCurrentMenu} />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-stretch">
                  <div className="xl:col-span-3">
                    <CategoryAnalysis />
                  </div>
                  <div className="xl:col-span-7">
                    <Quotes />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* 캘린더 페이지 */}
          {currentMenu === "calendar" && <CalendarPage />}
          {/* 할 일 관리 페이지 */}
          {currentMenu === "tasks" && <TodoManagePage />}
        </main>
      </div>
    </div>
  );
}
