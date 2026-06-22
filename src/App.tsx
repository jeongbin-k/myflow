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

import { useTodos } from "./hooks/useTodos";
import myflow from "./assets/images/myflow.png";
import { useState } from "react";
import {
  IconHome,
  IconCheckbox,
  IconCalendar,
  IconArrowBarToLeft,
  IconArrowBarToRight,
} from "@tabler/icons-react";

// 메뉴관리
const menus = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <IconHome stroke={2} size={20} />,
  },
  { id: "tasks", label: "할 일 관리", icon: <IconCheckbox size={20} /> },
  { id: "calendar", label: "캘린더", icon: <IconCalendar size={20} /> },
];

export default function App() {
  const [currentMenu, setCurrentMenu] = useState("dashboard");
  // 1. 사이드바 열림/닫힘 상태 추가 (기본값: 열림)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 할 일 추가 모달
  const { isModalOpen, setIsModalOpen } = useTodos();

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
          className="absolute -right-3 top-4.5 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500 hover:text-slate-800 hover:shadow-sm cursor-pointer z-50 transition-all"
        >
          {isSidebarOpen ? (
            <IconArrowBarToLeft stroke={2} size={20} />
          ) : (
            <IconArrowBarToRight stroke={2} size={20} />
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

        {/* 프로필 영역 (닫혔을 때는 아바타만 노출) */}
        <div
          className={`border-t border-slate-100 pt-4 flex items-center gap-3 ${isSidebarOpen ? "" : "justify-center"}`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
            <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">
              JB
            </div>
          </div>
          {isSidebarOpen && (
            <div className="transition-all duration-200">
              <p className="text-sm font-semibold text-slate-800">Jeong Bin</p>
              <p className="text-xs text-slate-400">오늘도 화이팅! 💪</p>
            </div>
          )}
        </div>
      </aside>

      {/* 우측 메인 대시보드 영역 */}
      <main
        id="dashboard-scroll-area"
        className="flex-1 h-full overflow-y-auto p-8"
      >
        {/* 상단 헤더 */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              안녕하세요, JeongBin님! 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              오늘도 멋진 하루를 만들어가요.
            </p>
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-indigo-100 transition-all flex items-center gap-1 "
            onClick={() => setIsModalOpen(true)}
          >
            <span>+</span> 할 일 등록
          </button>
        </header>

        {/*  대시보드 3층 레이아웃 컨테이너 */}
        <div className="space-y-6">
          {/* [1층]: 달력(2/4) + 도넛(1/4) + 막대(1/4) */}
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

          {/* [2층]: 오늘 할 일(1/3) + 완료 추이(1/3) + 최근 완료(1/3)*/}
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-stretch">
            <div className="xl:col-span-3">
              <TodoToday />
            </div>
            <div className="xl:col-span-4">
              <TodoTrend />
            </div>
            <div className="xl:col-span-3">
              <TodoRecent />
            </div>
          </div>

          {/* [3층]: 카텍고리 분석 도넛 차트 / 오늘의 명언 */}
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-stretch">
            <div className="xl:col-span-3">
              <CategoryAnalysis />
            </div>
            <div className="xl:col-span-7">
              <Quotes />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
