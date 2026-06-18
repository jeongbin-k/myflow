import { useState } from "react";

interface Quote {
  text: string;
  author: string;
}

export default function Quotes() {
  const quoteList: Quote[] = [
    { text: "작은 노력이 모여 큰 결과를 만듭니다.", author: "앤디 워홀" },
    {
      text: "단지 내가 겪은 고통일 뿐, 내 미래의 한계가 아니다.",
      author: "오프라 윈프리",
    },
    {
      text: "성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다.",
      author: "윈스턴 처칠",
    },
    {
      text: "오늘 할 수 있는 일에 온 힘을 다해라. 그러면 내일은 한 걸음 더 나아가 있을 것이다.",
      author: "뉴턴",
    },
    {
      text: "결과를 바꾸고 싶다면, 지금 당장 행동의 흐름(Flow)을 바꿔라.",
      author: "MyFlow 익명",
    },
  ];

  const [currentQuote] = useState<Quote>(() => {
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    return quoteList[randomIndex];
  });

  return (
    // 🎨 변경 포인트 1: bg-white 대신 연한 인디고 틴트 배경을 깔아 허전한 여백을 공간감으로 채웁니다.
    <div className="w-full h-[280px] bg-gradient-to-br from-indigo-50/20 via-slate-50/40 to-white border border-slate-100 rounded-2xl p-8 shadow-sm flex relative overflow-hidden group justify-between items-center">
      {/* 🌌 변경 포인트 2: 우측 일러스트 영역의 크기와 그라데이션 범위를 45%로 넓히고 색감을 살렸습니다. */}
      <div className="absolute right-0 bottom-0 top-0 w-[45%] bg-gradient-to-l from-indigo-100/50 via-purple-50/30 to-transparent pointer-events-none rounded-r-2xl transition-all duration-700" />

      {/* ⛰️ 산 모양 일러스트 크기를 키우고 우측 하단에 딱 안정감 있게 안착 */}
      <div className="absolute right-0 bottom-0 text-indigo-200/40 pointer-events-none transition-transform duration-700 ">
        <svg
          className="w-64 h-32 fill-current"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 100 L35 30 L65 75 L85 45 L100 100 Z" />
        </svg>
      </div>

      {/* 💬 왼쪽: 명언 텍스트 영역 (가로 폭을 55%로 제한해서 자연스러운 줄바꿈 유도) */}
      <div className="relative z-10 flex flex-col justify-between h-full max-w-[55%]">
        {/* 거대하고 투명한 배경 따옴표로 타이포그래피 포인트 주기 */}
        <div className="text-5xl font-serif font-extrabold text-indigo-200/70 select-none leading-none mb-2">
          “
        </div>

        {/* text-lg -> text-xl로 키우고 leading을 넓혀 텍스트 덩어리감 확보 */}
        <div className="my-auto">
          <p className="text-xl font-bold text-slate-700 leading-relaxed tracking-tight break-keep">
            {currentQuote.text}
          </p>
        </div>

        <div className="text-xs font-bold text-slate-400 tracking-tight mt-4">
          — {currentQuote.author}
        </div>
      </div>
    </div>
  );
}
