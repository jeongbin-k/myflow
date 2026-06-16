import { useState } from "react";

export default function App() {
  const [currentMenu, setCurrentMenu] = useState("dashboard");

  // 1. 사이드바 열림/닫힘 상태 추가 (기본값: 열림)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* 2. 좌측 사이드바 영역 */}
      <aside
        className={`h-full bg-white border-r border-slate-100 flex flex-col justify-between p-4 shrink-0 relative transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* 접기/펼치기 토글 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500 hover:text-slate-800 hover:shadow-sm cursor-pointer z-50 transition-all"
        >
          {isSidebarOpen ? "◀" : "▶"}
        </button>

        <div>
          {/* 로고 영역 (닫혔을 때는 글자 숨김) */}
          <div
            className={`flex items-center gap-2 mb-8 px-2 ${isSidebarOpen ? "" : "justify-center"}`}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
              M
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold text-slate-800 tracking-tight transition-all duration-200">
                MyFlow
              </span>
            )}
          </div>

          {/* 메뉴 리스트 */}
          <nav className="space-y-1">
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium text-sm transition-all ${isSidebarOpen ? "" : "justify-center"}`}
            >
              <span className="text-lg">📊</span>
              {isSidebarOpen && <span>대시보드</span>}
            </button>
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium text-sm transition-all text-left ${isSidebarOpen ? "" : "justify-center"}`}
            >
              <span className="text-lg">✔</span>
              {isSidebarOpen && <span>할 일 관리</span>}
            </button>
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium text-sm transition-all text-left ${isSidebarOpen ? "" : "justify-center"}`}
            >
              <span className="text-lg">📅</span>
              {isSidebarOpen && <span>캘린더</span>}
            </button>
          </nav>
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
              <p className="text-sm font-semibold text-slate-800">John Doe</p>
              <p className="text-xs text-slate-400">오늘도 화이팅! 💪</p>
            </div>
          )}
        </div>
      </aside>

      {/* 3. 우측 메인 대시보드 영역 */}
      <main className="flex-1 h-full overflow-y-auto p-8">
        {/* 상단 헤더 */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              안녕하세요, John님! 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              오늘도 멋진 하루를 만들어가요.
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-indigo-100 transition-all flex items-center gap-1 cursor-pointer">
            <span>+</span> 새 할 일 추가
          </button>
        </header>

        {/* 대시보드 메인 그리드 방 들어설 자리 */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl h-[calc(100vh-180px)] flex items-center justify-center bg-white transition-all">
          <p className="text-slate-400 font-medium">
            여기에 메인 캘린더와 차트들이 들어올 예정입니다!
          </p>
        </div>
      </main>
    </div>
  );
}
